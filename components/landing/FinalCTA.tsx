
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinalCTA: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-primary text-white">
            <div className="mx-auto max-w-4xl px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Pronto para ser notado pelos recrutadores?</h2>
                <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">Não deixe o robô decidir o seu futuro. Assuma o controle da sua carreira hoje mesmo com a ajuda da nossa IA.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-success px-8 py-4 text-base font-bold text-white shadow-lg hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200"
                >
                    Começar Agora Gratuitamente
                    <ArrowRight />
                </button>
                <p className="mt-4 text-sm text-blue-200">Sem cartão de crédito necessário para o plano gratuito.</p>
            </div>
        </section>
    );
};

export default FinalCTA;
