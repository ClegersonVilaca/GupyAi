
import React, { useState, useEffect } from 'react';
import { Bell, User, Bot } from 'lucide-react';
import Sidebar from '../components/shared/Sidebar';
import JobInputSection from '../components/dashboard/JobInputSection';
import AnalysisResults from '../components/dashboard/AnalysisResults';
import { supabase } from '../lib/supabaseClient';

const DashboardPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isPro, setIsPro] = useState(false);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [userName, setUserName] = useState('Usuário');

    useEffect(() => {
        const checkUserStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                if (user.user_metadata?.full_name) {
                    setUserName(user.user_metadata.full_name.split(' ')[0]);
                } else if (user.email) {
                    setUserName(user.email.split('@')[0]);
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_pro_user')
                    .eq('id', user.id)
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
                    if (error && typeof error === 'object' && 'context' in error) {
                        // @ts-ignore
                        const body = await error.context.json();
                        if (body?.error) {
                            errorMessage = body.error;
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

            setAnalysisData(data);
            setShowResults(true);

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
                        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-border-light group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold leading-none text-text-main group-hover:text-primary transition-colors">{userName}</p>
                                <p className="text-[10px] font-bold text-text-muted mt-0.5 uppercase tracking-wider">{isPro ? 'Plano Pro' : 'Plano Grátis'}</p>
                            </div>
                            <div className="bg-primary/10 rounded-full size-9 flex items-center justify-center overflow-hidden border border-gray-100 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                <User size={18} className="text-primary" />
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
                        <div className={`lg:col-span-12 xl:col-span-7 h-full overflow-hidden transition-all duration-500 ${showResults ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                            {showResults ? (
                                <AnalysisResults data={analysisData} />
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
        </div>
    );
};

export default DashboardPage;
