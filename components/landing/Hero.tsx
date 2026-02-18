
import React from 'react';
import { Rocket, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <section className="relative overflow-hidden bg-surface-light pt-16 pb-24 lg:pt-32 lg:pb-40">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-sm font-medium text-primary">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-success"></span>
                        </span>
                        Novo algoritmo 2024 atualizado
                    </div>
                    <h1 className="max-w-4xl text-5xl font-black tracking-tight text-gray-900 sm:text-6xl lg:text-7xl mb-6">
                        Vença o <span className="text-gradient">Robô da Gupy</span> e conquiste sua vaga
                    </h1>
                    <p className="max-w-2xl text-lg text-gray-600 mb-10 leading-relaxed">
                        Nossa inteligência artificial reescreve seu currículo para atingir 100% de compatibilidade com o algoritmo de recrutamento das maiores empresas do Brasil.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-primary-hover hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                            <Rocket />
                            Otimizar meu Currículo Agora
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <PlayCircle />
                            Ver demonstração
                        </button>
                    </div>
                    <div className="mt-12 flex flex-col items-center gap-3">
                        <div className="flex -space-x-3 overflow-hidden">
                            <img alt="User avatar" className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://picsum.photos/id/1/40/40" />
                            <img alt="User avatar" className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://picsum.photos/id/2/40/40" />
                            <img alt="User avatar" className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://picsum.photos/id/3/40/40" />
                            <img alt="User avatar" className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://picsum.photos/id/4/40/40" />
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-xs font-medium text-gray-600">+2k</div>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            <span className="font-bold text-gray-900">10,000+</span> currículos otimizados este mês
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
