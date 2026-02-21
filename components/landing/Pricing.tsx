
import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            const { data, error } = await supabase.functions.invoke('create-checkout-abacate', {
                body: {
                    user_email: user.email,
                    user_name: user.user_metadata?.full_name || user.email?.split('@')[0]
                }
            });

            if (error) throw error;

            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error('URL de checkout não recebida.');
            }
        } catch (error) {
            console.error('Error creating charge:', error);
            alert('Erro ao gerar cobrança. Tente novamente ou faça login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-background-light" id="precos">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Planos Simples</h2>
                    <p className="mt-4 text-lg text-gray-600">Invista na sua carreira pelo preço de um café.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Gratuito</h3>
                            <p className="text-gray-500 text-sm mt-1">Para quem quer testar a plataforma.</p>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">R$ 0</span>
                            <span className="text-gray-500">/mês</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3"><CheckCircle className="text-accent-success text-xl shrink-0" /><span className="text-gray-600">1 Análise de Currículo por mês</span></li>
                            <li className="flex items-start gap-3"><CheckCircle className="text-accent-success text-xl shrink-0" /><span className="text-gray-600">Score de compatibilidade básico</span></li>
                            <li className="flex items-start gap-3"><XCircle className="text-gray-300 text-xl shrink-0" /><span className="text-gray-400">Sem reescrita automática</span></li>
                            <li className="flex items-start gap-3"><XCircle className="text-gray-300 text-xl shrink-0" /><span className="text-gray-400">Sem gerador de Carta de Apresentação</span></li>
                        </ul>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full rounded-lg border-2 border-primary text-primary font-bold py-3 px-4 hover:bg-blue-50 transition-colors"
                        >
                            Começar Grátis
                        </button>
                    </div>
                    {/* Pro Plan */}
                    <div className="bg-white rounded-2xl p-8 border-2 border-primary shadow-xl relative flex flex-col transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 -mt-4 mr-4 bg-accent-success text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">MAIS POPULAR</div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                            <p className="text-gray-500 text-sm mt-1">Para quem tem pressa de ser contratado.</p>
                        </div>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">R$ 29</span>
                            <span className="text-gray-500">/mês</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start gap-3"><CheckCircle className="text-accent-success text-xl shrink-0" /><span className="text-gray-700 font-medium">Otimizações Ilimitadas</span></li>
                            <li className="flex items-start gap-3"><CheckCircle className="text-accent-success text-xl shrink-0" /><span className="text-gray-700 font-medium">IA que reescreve suas experiências</span></li>
                            <li className="flex items-start gap-3"><CheckCircle className="text-accent-success text-xl shrink-0" /><span className="text-gray-700 font-medium">Gerador de Carta de Apresentação</span></li>
                            <li className="flex items-start gap-3"><CheckCircle className="text-accent-success text-xl shrink-0" /><span className="text-gray-700 font-medium">Download em PDF amigável para ATS</span></li>
                        </ul>
                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="w-full rounded-lg bg-primary text-white font-bold py-3 px-4 hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400"
                        >
                            {loading ? 'Processando...' : 'Assinar Pro Agora'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
