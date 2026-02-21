
import React, { useState, useEffect } from 'react';
import { Bell, User, Bot, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import JobInputSection from '../components/dashboard/JobInputSection';
import AnalysisResults from '../components/dashboard/AnalysisResults';
import { supabase } from '../lib/supabaseClient';
import { FunctionsError } from '@supabase/supabase-js';
import UpgradeModal from '../components/shared/UpgradeModal';

export interface AnalysisData {
    score: number;
    hardSkills: number;
    softSkills: number;
    keywordsMatch: string;
    formattingScore: number;
    missingKeywords: { title: string; sub: string }[];
    strengths: string[];
    suggestions: { title: string; desc: string; type: string }[];
    parsedResume?: any;
}

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isPro, setIsPro] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [userName, setUserName] = useState('Usuário');
    const [user, setUser] = useState<any>(null);
    const [loadingStep, setLoadingStep] = useState(0);

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-abacate', {
                body: {
                    user_email: user?.email,
                    user_name: user?.user_metadata?.full_name || user?.email?.split('@')[0]
                }
            });

            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error('Error initiating upgrade:', error);
            alert(`Erro ao iniciar upgrade: ${error.message}`);
        } finally {
            setIsUpgrading(false);
        }
    };

    const loadingSteps = [
        "Extraindo texto do currículo...",
        "Analisando requisitos da vaga...",
        "Avaliando palavras-chave...",
        "Calculando score de compatibilidade...",
        "Gerando sugestões personalizadas..."
    ];

    useEffect(() => {
        let interval: any;
        if (isOptimizing) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isOptimizing]);

    useEffect(() => {
        const checkUserStatus = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                setUser(authUser);
                if (authUser.user_metadata?.full_name) {
                    setUserName(authUser.user_metadata.full_name.split(' ')[0]);
                } else if (authUser.email) {
                    setUserName(authUser.email.split('@')[0]);
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_pro_user')
                    .eq('id', authUser.id)
                    .maybeSingle();

                if (profile) setIsPro(profile.is_pro_user);
            }
        };
        checkUserStatus();
    }, []);

    const handleOptimize = async () => {
        if (!jobDescription.trim() || !file) {
            alert('Por favor, insira a descrição da vaga e carregue seu currículo.');
            return;
        }

        setIsOptimizing(true);
        setShowResults(false);

        try {
            // Extração de texto do PDF
            const pdfjs = await import('pdfjs-dist');
            // @ts-ignore
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            let resumeText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');
                resumeText += pageText + ' ';
            }

            if (!resumeText.trim()) {
                throw new Error('Não foi possível extrair texto do PDF. Certifique-se que o arquivo não está protegido.');
            }

            const { data, error } = await supabase.functions.invoke('optimize-resume', {
                body: {
                    jobDescription: jobDescription.trim(),
                    resumeText: resumeText.trim()
                }
            });

            if (error) {
                console.error('Supabase Function Error:', error);
                let errorMessage = error.message || 'Erro desconhecido ao chamar a função.';

                // Tenta extrair mensagem de erro mais detalhada
                try {
                    // Check if error is a FunctionsError and has a context that might be a Response
                    if (error && typeof error === 'object' && 'context' in error) {
                        const functionsError = error as FunctionsError;
                        if (functionsError.context instanceof Response) {
                            const response = functionsError.context;
                            const body = await response.json();
                            if (body?.error) {
                                errorMessage = body.error;
                            }
                        }
                    }
                } catch (e) {
                    // ignora erro ao parsear
                }

                throw new Error(errorMessage);
            }

            if (!data) {
                throw new Error('A função retornou uma resposta vazia.');
            }

            // Transform parsedResume if needed to match Editor's ResumeData interface
            if (data.parsedResume) {
                const transformedResume = {
                    ...data.parsedResume,
                    // If AI returns 'experience', rename to 'experiences'
                    experiences: (data.parsedResume.experience || data.parsedResume.experiences || []).map((exp: any) => ({
                        company: exp.company || '',
                        position: exp.position || '',
                        duration: exp.period || exp.duration || '',
                        bulletPoints: Array.isArray(exp.description) ? exp.description : [exp.description || '']
                    })),
                    // If AI returns 'education', rename to 'education' (already array usually)
                    education: (data.parsedResume.education || []).map((edu: any) => ({
                        institution: edu.institution || '',
                        degree: edu.degree || '',
                        year: edu.period || edu.year || ''
                    }))
                };

                data.parsedResume = transformedResume;
            }

            setAnalysisData(data);
            setShowResults(true);

            // Sync parsedResume to Supabase
            if (data.parsedResume) {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (currentUser) {
                    await supabase
                        .from('resumes')
                        .upsert({
                            user_id: currentUser.id,
                            resume_data: data.parsedResume
                        }, { onConflict: 'user_id' });

                    // Also save to localStorage for immediate use if needed
                    localStorage.setItem('last_parsed_resume', JSON.stringify(data.parsedResume));
                }
            }

        } catch (error: any) {
            console.error('Error optimizing:', error);
            alert(`Erro na análise: ${error.message}`);
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="bg-background-light min-h-screen flex font-sans text-text-main overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-surface-light border-b border-border-light h-16 px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Bot size={20} />
                        </div>
                        <h2 className="text-primary text-lg font-bold tracking-tight">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-full hover:bg-gray-100 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 size-2 bg-accent-danger rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-border-light mx-1"></div>
                        <button
                            onClick={!isPro ? () => setIsUpgradeModalOpen(true) : undefined}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl transition-all group"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-text-main line-clamp-1">{userName}</p>
                                <p className={`text-[10px] font-bold mt-0.5 uppercase tracking-wider ${isPro ? 'text-amber-600' : 'text-text-muted hover:text-primary transition-colors'}`}>
                                    {isPro ? 'Plano Pro' : 'Upgrade para Pro'}
                                </p>
                            </div>
                            <div className="bg-primary/10 rounded-full size-9 flex items-center justify-center overflow-hidden border border-gray-100 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={18} className="text-primary" />
                                )}
                            </div>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-w-[1600px] mx-auto">
                        {/* LEFT COLUMN: INPUT ZONE */}
                        <div className="lg:col-span-12 xl:col-span-5 h-full overflow-hidden">
                            <JobInputSection
                                file={file}
                                setFile={setFile}
                                jobDescription={jobDescription}
                                setJobDescription={setJobDescription}
                                onOptimize={handleOptimize}
                                isOptimizing={isOptimizing}
                            />
                        </div>

                        {/* RIGHT COLUMN: ANALYSIS ZONE */}
                        <div className={`lg:col-span-12 xl:col-span-7 h-full overflow-hidden transition-all duration-500 ${showResults || isOptimizing ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                            {isOptimizing ? (
                                <div className="bg-white rounded-2xl border border-border-light h-full flex flex-col items-center justify-center text-center p-12">
                                    <div className="relative mb-8">
                                        <div className="size-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                                            {Math.round((loadingStep + 1) / loadingSteps.length * 100)}%
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main mb-2">Otimizando currículo...</h3>
                                    <p className="text-sm text-text-muted animate-pulse">{loadingSteps[loadingStep]}</p>

                                    <div className="mt-8 w-full max-w-xs space-y-2">
                                        {loadingSteps.map((step, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`size-2 rounded-full ${i <= loadingStep ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                                <span className={`text-xs ${i === loadingStep ? 'text-primary font-bold' : 'text-text-muted'}`}>{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : showResults ? (
                                <AnalysisResults data={analysisData!} />
                            ) : (
                                <div className="bg-white rounded-2xl border border-dashed border-border-light h-full flex flex-col items-center justify-center text-center p-12">
                                    <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                        <Bot size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-text-main mb-2">Aguardando Análise</h3>
                                    <p className="text-sm text-text-muted max-w-xs">Carregue seu currículo e insira a descrição da vaga para ver os resultados aqui.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgrade={handleUpgrade}
                isSubmitting={isUpgrading}
            />
        </div>
    );
};

export default DashboardPage;
