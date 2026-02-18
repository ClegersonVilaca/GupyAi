
import React, { useState } from 'react';
import { Download, HelpCircle, CheckCircle, Bot } from 'lucide-react';
import Sidebar from '../components/shared/Sidebar';
import EditorForm from '../components/editor/EditorForm';
import ResumePreview from '../components/editor/ResumePreview';

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
    const [zoom, setZoom] = useState(100);
    const [atsMode, setAtsMode] = useState(false);
    const [resumeData, setResumeData] = useState<ResumeData>({
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

    const handleApplySuggestion = (newSummary: string) => {
        setResumeData(prev => ({ ...prev, summary: newSummary }));
    };

    const handleDownloadPDF = () => {
        window.print();
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
                        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-accent-success bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                            <CheckCircle size={14} />
                            <span>SALVO AUTOMATICAMENTE</span>
                        </div>
                        <button className="text-text-muted hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50">
                            <HelpCircle size={20} />
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <Download size={18} />
                            <span>Download PDF</span>
                        </button>
                        <div className="size-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer">
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
