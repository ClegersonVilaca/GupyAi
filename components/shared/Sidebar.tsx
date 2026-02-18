
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePenLine, History, Settings, Bot, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <FilePenLine size={20} />, label: 'Editor de Currículo', path: '/editor' },
        { icon: <History size={20} />, label: 'Histórico', path: '/history' },
        { icon: <Bot size={20} />, label: 'Mentoria IA', path: '/mentoria' },
    ];

    const isActive = (path: string) => location.pathname === path;

    // Se estiver em uma rota que não é Dashboard ou Editor, mostrar "Em Breve"
    const isComingSoon = ['/history', '/mentoria', '/settings'].includes(location.pathname);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        }
        navigate('/login');
    };

    return (
        <>
            <aside className="w-64 bg-surface-light border-r border-border-light flex flex-col h-full shrink-0 hidden md:flex">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            <Bot size={24} />
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-text-main">
                            Gupy<span className="text-primary">AI</span>
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item, index) => {
                        const isLinkDisabled = ['/history', '/mentoria'].includes(item.path);
                        const content = (
                            <>
                                <span className={isActive(item.path) ? 'text-white' : 'text-text-muted group-hover:text-primary transition-colors'}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {isLinkDisabled && (
                                    <span className="ml-auto text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">Breve</span>
                                )}
                            </>
                        );

                        if (isLinkDisabled) {
                            return (
                                <button
                                    key={index}
                                    disabled
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-text-muted cursor-not-allowed opacity-70`}
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive(item.path)
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
                                    }`}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border-light space-y-1">
                    <button
                        disabled
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-text-muted cursor-not-allowed opacity-70`}
                    >
                        <Settings size={20} className="group-hover:text-primary transition-colors" />
                        Configurações
                        <span className="ml-auto text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">Breve</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-text-muted hover:bg-red-50 hover:text-accent-danger transition-all group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        Sair
                    </button>
                </div>
            </aside>

            {isComingSoon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm md:left-64">
                    <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-sm mx-4 animate-in zoom-in-95 duration-300">
                        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                            <Bot size={40} className="animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-main mb-3">Em Breve!</h2>
                        <p className="text-text-muted mb-8 leading-relaxed">
                            Estamos trabalhando pesado nesta funcionalidade. Volte em alguns dias!
                        </p>
                        <Link
                            to="/dashboard"
                            className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Voltar ao Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
