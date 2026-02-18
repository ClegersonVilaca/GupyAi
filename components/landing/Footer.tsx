
import React from 'react';
import { Bot } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-background-dark text-gray-400 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 text-white mb-4">
                            <Bot className="text-primary" />
                            <span className="text-xl font-bold">GupyAI</span>
                        </div>
                        <p className="text-sm leading-relaxed">Ajudando profissionais a vencerem os algoritmos de recrutamento e conquistarem seus sonhos.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Produto</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a className="hover:text-primary transition-colors" href="#">Como funciona</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Preços</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Para Empresas</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Recursos</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a className="hover:text-primary transition-colors" href="#">Blog de Carreira</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Modelos de Currículo</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Calculadora de Salário</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a className="hover:text-primary transition-colors" href="#">Termos de Uso</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Privacidade</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Contato</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm">© 2026 GupyAI. Todos os direitos reservados.</p>
                    <div className="flex gap-4">
                        <a className="hover:text-white transition-colors" href="#">LinkedIn</a>
                        <a className="hover:text-white transition-colors" href="#">Instagram</a>
                        <a className="hover:text-white transition-colors" href="#">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
