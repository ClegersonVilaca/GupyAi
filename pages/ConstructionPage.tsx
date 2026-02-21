
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Construction } from 'lucide-react';
import Sidebar from '../components/shared/Sidebar';

interface ConstructionPageProps {
    title: string;
    description: string;
}

const ConstructionPage: React.FC<ConstructionPageProps> = ({ title, description }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light text-text-main h-screen flex overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="font-bold text-text-main text-lg tracking-tight">{title}</h1>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                        <Construction size={48} className="animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-text-main mb-4">{title}</h2>
                    <p className="text-text-muted max-w-md mx-auto mb-10 leading-relaxed text-lg">
                        {description}
                    </p>
                    <div className="bg-white p-8 rounded-3xl border border-border-light shadow-lg max-w-sm flex items-center gap-4">
                        <div className="size-12 bg-accent-success/10 rounded-xl flex items-center justify-center text-accent-success">
                            <Bot size={28} />
                        </div>
                        <div className="text-left font-bold text-sm">
                            <p className="text-text-main">Nossa IA está trabalhando!</p>
                            <p className="text-accent-success">Previsão: 48 horas</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ConstructionPage;
