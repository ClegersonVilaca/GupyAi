
import React, { useState, useEffect } from 'react';
import { Download, HelpCircle, CheckCircle, Bot, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Sidebar from '../components/shared/Sidebar';
import EditorForm from '../components/editor/EditorForm';
import ResumePreview from '../components/editor/ResumePreview';
import { supabase } from '../lib/supabaseClient';

export interface Experience {
    company: string;
    position: string;
    duration: string;
    bulletPoints: string[];
}

export interface Education {
    institution: string;
    degree: string;
    year: string;
}

export interface ResumeData {
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
    summary: string;
    experiences: Experience[];
    education: Education[];
}

const EditorPage: React.FC = () => {
    const navigate = useNavigate();
    const [zoom, setZoom] = React.useState(100);
    const [atsMode, setAtsMode] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isExporting, setIsExporting] = React.useState(false);
    const resumeRef = React.useRef<HTMLDivElement>(null);
    const [resumeData, setResumeData] = React.useState<ResumeData>({
        name: 'Mariana Costa',
        jobTitle: 'Gerente de Produto Sênior',
        email: 'mariana.costa@email.com',
        phone: '(11) 99999-9999',
        linkedin: 'linkedin.com/in/mariana-costa',
        location: 'São Paulo, SP',
        summary: 'Profissional com mais de 8 anos de experiência em gestão de produtos digitais, focado em metodologias ágeis e crescimento de receita.',
        experiences: [
            {
                company: 'Tech Solutions Inc.',
                position: 'Product Manager',
                duration: 'Jan 2020 - Dez 2023',
                bulletPoints: [
                    'Liderança de squad de 12 desenvolvedores utilizando metodologia Scrum.',
                    'Aumento de 40% na retenção de usuários através de melhorias de UX.',
                ]
            }
        ],
        education: [
            {
                institution: 'Universidade de São Paulo (USP)',
                degree: 'Bacharelado em Engenharia de Produção',
                year: '2016'
            }
        ]
    });

    // Carregar dados iniciais (do localStorage ou Supabase)
    React.useEffect(() => {
        const loadResume = async () => {
            // Tenta carregar do localStorage primeiro (mais rápido após otimização)
            const cached = localStorage.getItem('last_parsed_resume');
            if (cached) {
                try {
                    setResumeData(JSON.parse(cached));
                    // Opcionalmente limpa após carregar, ou deixa para ser sobrescrito
                    // localStorage.removeItem('last_parsed_resume');
                } catch (e) {
                    console.error('Error parsing cached resume:', e);
                }
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('resumes')
                .select('resume_data')
                .eq('user_id', user.id)
                .maybeSingle();

            if (data && data.resume_data) {
                setResumeData(data.resume_data as ResumeData);
            }
        };
        loadResume();
    }, []);

    // Salvar dados com debounce
    React.useEffect(() => {
        const timer = setTimeout(async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setIsSaving(true);
            const { error } = await supabase
                .from('resumes')
                .upsert({
                    user_id: user.id,
                    resume_data: resumeData
                }, { onConflict: 'user_id' });

            if (error) console.error('Error saving resume:', error);
            setIsSaving(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [resumeData]);

    const handleApplySuggestion = (content: string, type: string = 'summary') => {
        if (type === 'summary') {
            setResumeData(prev => ({ ...prev, summary: content }));
        } else if (type === 'experience') {
            // Se for uma sugestão de experiência, poderíamos adicionar ou substituir
            // Por enquanto, vamos manter no summary ou permitir identificar o campo
            setResumeData(prev => ({ ...prev, summary: content }));
        }
    };

    const handleDownloadPDF = async () => {
        if (!resumeRef.current) return;

        setIsExporting(true);
        try {
            // Set zoom to 100% for capture
            const originalZoom = zoom;
            setZoom(100);

            // Wait for zoom state to apply (render)
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(resumeRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Curriculo_Otimizado_${new Date().getTime()}.pdf`);

            // Restore zoom
            setZoom(originalZoom);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Erro ao exportar PDF. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-background-light text-text-main h-screen flex overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-text-main text-lg leading-tight">Editor de Currículo</h1>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Otimizado para algoritmo Gupy</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`hidden lg:flex items-center gap-2 text-xs font-bold ${isSaving ? 'text-amber-500 bg-amber-50 border-amber-100' : 'text-accent-success bg-green-50 border-green-100'} px-3 py-1.5 rounded-full border transition-all`}>
                            {isSaving ? (
                                <>
                                    <div className="size-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span>SALVANDO...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={14} />
                                    <span>SALVO AUTOMATICAMENTE</span>
                                </>
                            )}
                        </div>
                        <button className="text-text-muted hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50">
                            <HelpCircle size={20} />
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isExporting}
                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isExporting ? (
                                <>
                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Exportando...</span>
                                </>
                            ) : (
                                <>
                                    <Download size={18} />
                                    <span>Download PDF</span>
                                </>
                            )}
                        </button>
                        <div
                            onClick={() => navigate('/profile')}
                            className="size-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer"
                        >
                            <img alt="User Profile" className="w-full h-full object-cover" src="https://picsum.photos/id/65/32/32" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex overflow-hidden">
                    <EditorForm
                        resumeData={resumeData}
                        setResumeData={setResumeData}
                        onApplySuggestion={handleApplySuggestion}
                    />
                    <ResumePreview
                        ref={resumeRef}
                        resumeData={resumeData}
                        zoom={zoom}
                        setZoom={setZoom}
                        atsMode={atsMode}
                        setAtsMode={setAtsMode}
                    />
                </main>
            </div>
        </div>
    );
};

export default EditorPage;
