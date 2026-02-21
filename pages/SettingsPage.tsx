
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Bell, Lock, Eye, Globe, Moon, Laptop, Sun } from 'lucide-react';
import Sidebar from '../components/shared/Sidebar';
import { useToast } from '../components/shared/Toast';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');

    React.useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', systemDark);
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className="bg-background-light text-text-main h-screen flex overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="font-bold text-text-main text-lg tracking-tight">Configurações</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-3xl mx-auto space-y-8 pb-10">
                        <div className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden text-sm">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <h2 className="font-bold flex items-center gap-2 text-base">
                                    <Settings className="text-primary" size={20} />
                                    Preferências Gerais
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-50">
                                <div className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-bold text-text-main flex items-center gap-2">
                                            {theme === 'light' ? <Sun size={16} /> : theme === 'dark' ? <Moon size={16} /> : <Laptop size={16} />}
                                            Aparência do Sistema
                                        </p>
                                        <p className="text-xs text-text-muted">Escolha como o GupyAI deve ser exibido para você.</p>
                                    </div>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
                                        >
                                            Claro
                                        </button>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
                                        >
                                            Escuro
                                        </button>
                                        <button
                                            onClick={() => setTheme('system')}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'system' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
                                        >
                                            Sistema
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-bold text-text-main flex items-center gap-2">
                                            <Bell size={16} /> Notificações
                                        </p>
                                        <p className="text-xs text-text-muted">Deseja receber dicas de carreira por email?</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked onChange={() => showToast('Preferência de notificação atualizada.', 'info')} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-bold text-text-main flex items-center gap-2">
                                            <Globe size={16} /> Idioma do App
                                        </p>
                                        <p className="text-xs text-text-muted">O idioma das análises e da interface.</p>
                                    </div>
                                    <select
                                        className="bg-gray-50 border border-border-light rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                        onChange={() => showToast('Idioma alterado com sucesso.', 'success')}
                                    >
                                        <option>Português (Brasil)</option>
                                        <option>English</option>
                                        <option>Español</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden text-sm">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <h2 className="font-bold flex items-center gap-2 text-base">
                                    <Lock className="text-primary" size={20} />
                                    Privacidade e Dados
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-50">
                                <div className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-bold text-text-main flex items-center gap-2">
                                            <Eye size={16} /> Visibilidade do Perfil
                                        </p>
                                        <p className="text-xs text-text-muted">Permitir que recrutadores encontrem seu perfil otimizado.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" onChange={(e) => showToast(e.target.checked ? 'Perfil agora está visível.' : 'Perfil agora está privado.', 'info')} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="p-6">
                                    <button
                                        className="text-xs font-bold text-accent-danger hover:underline"
                                        onClick={() => navigate('/profile')}
                                    >
                                        Gerenciar Chaves de Segurança e Senha →
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="text-center py-4">
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">GupyAI Versão 2.4.0 (2026)</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;
