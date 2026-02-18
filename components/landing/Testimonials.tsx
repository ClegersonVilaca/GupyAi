
import React from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';

const testimonials = [
    {
        quote: "\"Fui reprovada em 15 processos seguidos na Gupy. Depois de passar meu CV na GupyAI, fui chamada para 3 entrevistas na mesma semana!\"",
        name: "Mariana Souza",
        title: "Contratada na XP",
        avatar: "https://picsum.photos/id/21/48/48"
    },
    {
        quote: "\"O gerador de palavras-chave é surreal. Ele achou termos técnicos da vaga que eu nem sabia que precisava colocar no meu resumo.\"",
        name: "Carlos Mendes",
        title: "Aprovado na Ambev",
        avatar: "https://picsum.photos/id/22/48/48"
    },
    {
        quote: "\"Simplesmente funciona. A análise mostrou que meu CV estava com 40% de match. Subi pra 95% e a mágica aconteceu.\"",
        name: "João Pedro",
        title: "Contratado no Mercado Livre",
        avatar: "https://picsum.photos/id/23/48/48"
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-24 bg-white overflow-hidden" id="depoimentos">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Resultados Reais</h2>
                        <p className="mt-4 text-lg text-gray-600">Veja quem já conseguiu hackear o sistema e conquistar o emprego dos sonhos.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600"><ArrowLeft /></button>
                        <button className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600"><ArrowRight /></button>
                    </div>
                </div>
                <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 snap-x hide-scrollbar">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="min-w-[320px] md:min-w-[380px] bg-background-light rounded-2xl p-8 snap-center border border-gray-100">
                            <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="text-sm" />)}
                            </div>
                            <p className="text-gray-800 font-medium text-lg mb-6">{testimonial.quote}</p>
                            <div className="flex items-center gap-4">
                                <img alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" src={testimonial.avatar} />
                                <div>
                                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-accent-success font-medium">{testimonial.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
