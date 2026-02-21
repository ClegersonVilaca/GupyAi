
import React from 'react';
import { X, Check, Zap, Bot, FileText, Star } from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
    isSubmitting: boolean;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, isSubmitting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header Gradient */}
                <div className="bg-gradient-to-br from-primary to-blue-600 p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                            <Zap className="text-yellow-300 fill-yellow-300" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">GupyAI Pro</h2>
                            <p className="text-white/80 font-medium text-sm">Desbloqueie o poder máximo da sua carreira</p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-4xl font-black">R$ 29,90</span>
                        <span className="text-white/70 font-bold">/mês</span>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <h3 className="font-bold text-text-main">O que você recebe no Plano Pro:</h3>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="size-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={12} className="text-green-600 stroke-[3]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-main">Otimizações Ilimitadas</p>
                                <p className="text-xs text-text-muted">Analise quantos currículos e vagas desejar.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="size-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={12} className="text-green-600 stroke-[3]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-main">Mentoria IA Personalizada</p>
                                <p className="text-xs text-text-muted">Dicas de entrevista e carreira baseadas no seu perfil.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="size-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={12} className="text-green-600 stroke-[3]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-main">Modelos Exclusivos</p>
                                <p className="text-xs text-text-muted">Acesso a templates de currículo de alta performance.</p>
                            </div>
                        </li>
                    </ul>

                    <button
                        onClick={onUpgrade}
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>ASSINAR AGORA</span>
                                <Zap size={20} className="fill-white" />
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-center text-text-muted font-bold uppercase tracking-widest">
                        Pagamento Seguro via AbacatePay • Cancele a qualquer momento
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
