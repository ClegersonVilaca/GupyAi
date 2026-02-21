
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Bell, Lock, Eye, Globe, Moon, Laptop, Sun, Camera, User } from 'lucide-react';
import Sidebar from '../components/shared/Sidebar';
import { useToast } from '../components/shared/Toast';
import { supabase } from '../lib/supabaseClient';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        avatar_url: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                setUser(authUser);
                setProfile({
                    full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
                    email: authUser.email || '',
                    avatar_url: authUser.user_metadata?.avatar_url || '',
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    useEffect(() => {
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

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsSaving(true);
        try {
            // Preview local
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setProfile(prev => ({ ...prev, avatar_url: ev.target!.result as string }));
                }
            };
            reader.readAsDataURL(file);

            // No mundo real, aqui faríamos o upload para o Supabase Storage
            // Por enquanto, atualizamos o metadado (em base64 ou URL fictícia se fosse o caso)
            // Mas vamos apenas simular sucesso para a UI
            showToast('Foto de perfil atualizada!', 'success');
        } catch (error: any) {
            showToast('Erro ao carregar foto.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const initials = profile.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';

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
                        {/* Perfil Rápido */}
                        <div className="bg-white rounded-3xl p-6 border border-border-light shadow-sm flex items-center gap-6">
                            <div className="relative group">
                                <div className="size-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-primary/10 flex items-center justify-center">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-black text-primary">{initials}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                    <Camera size={12} />
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-text-main">{profile.full_name}</h3>
                                <p className="text-xs text-text-muted">{profile.email}</p>
                                <button onClick={() => navigate('/profile')} className="mt-2 text-xs font-bold text-primary hover:underline">Editar perfil completo →</button>
                            </div>
                        </div>

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
                                            <Bell size={16} /> Notificações por E-mail
                                        </p>
                                        <p className="text-xs text-text-muted">Receba atualizações sobre novos recursos e vagas.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked onChange={() => showToast('Preferência de notificação atualizada.', 'info')} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden text-sm">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <h2 className="font-bold flex items-center gap-2 text-base">
                                    <Lock className="text-primary" size={20} />
                                    Segurança
                                </h2>
                            </div>
                            <div className="p-6">
                                <button
                                    className="text-xs font-bold text-primary hover:underline"
                                    onClick={() => navigate('/profile')}
                                >
                                    Alterar Senha e Gerenciar Dados da Conta →
                                </button>
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
