
import React from 'react';
import { FileUp, BrainCircuit, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: <FileUp size={32} />,
        title: "1. Upload do PDF",
        description: "Envie seu currículo atual ou exporte seu perfil do LinkedIn em PDF."
    },
    {
        icon: <BrainCircuit size={32} />,
        title: "2. Análise de IA",
        description: "Nossa IA identifica a vaga desejada e injeta as palavras-chave exatas."
    },
    {
        icon: <CheckCircle size={32} />,
        title: "3. Download e Aplique",
        description: "Baixe a versão otimizada com formatação amigável para ATS e aplique."
    }
];

const HowItWorks: React.FC = () => {
    return (
        <section className="py-24 bg-background-light" id="como-funciona">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Como funciona</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Em apenas 3 passos simples, aumente suas chances de passar na triagem automática.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>
                    {steps.map((step, index) => (
                         <div key={index} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center">
                                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${index === 2 ? 'bg-accent-success/10 text-accent-success border-green-100' : 'bg-blue-50 text-primary border-blue-100'} border`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
