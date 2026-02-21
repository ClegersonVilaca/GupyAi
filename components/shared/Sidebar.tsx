
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

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        }
        navigate('/');
    };

    return (
        <>
            <aside className="w-64 bg-surface-light border-r border-border-light flex flex-col min-h-screen shrink-0 hidden md:flex">
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
                        const content = (
                            <>
                                <span className={isActive(item.path) ? 'text-white' : 'text-text-muted group-hover:text-primary transition-colors'}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </>
                        );

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
                    <Link
                        to="/settings"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive('/settings')
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
                            }`}
                    >
                        <Settings size={20} className={isActive('/settings') ? 'text-white' : 'group-hover:text-primary transition-colors'} />
                        Configurações
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-text-muted hover:bg-red-50 hover:text-accent-danger transition-all group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        Sair
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
