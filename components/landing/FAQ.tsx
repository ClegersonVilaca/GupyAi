
import React from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
    {
        question: "O que é um sistema ATS?",
        answer: "ATS (Applicant Tracking System) é o software usado por empresas (como a Gupy) para filtrar automaticamente currículos. Se seu CV não tiver as palavras-chave certas ou a formatação correta, ele é descartado antes mesmo de um humano ler."
    },
    {
        question: "A GupyAI garante minha contratação?",
        answer: "Não podemos garantir a contratação final, pois isso depende da entrevista. O que garantimos é que seu currículo terá muito mais chances de passar pela triagem inicial do robô e chegar na mão do recrutador."
    },
    {
        question: "Posso cancelar a qualquer momento?",
        answer: "Sim! O plano Pro é mensal e sem fidelidade. Você pode assinar, otimizar todos os seus currículos e cancelar quando quiser."
    }
];

const FAQ: React.FC = () => {
    return (
        <section className="py-24 bg-white">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">Dúvidas Frequentes</h2>
                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <details key={index} className="group border border-gray-200 rounded-xl bg-white [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900 hover:bg-gray-50 transition-colors rounded-xl">
                                <h3 className="font-medium text-lg">{item.question}</h3>
                                <ChevronDown className="text-gray-500 transition duration-300 group-open:-rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                {item.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
