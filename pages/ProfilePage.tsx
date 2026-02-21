
import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Shield, Camera, Save, ArrowLeft, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import { supabase } from '../lib/supabaseClient';
import UpgradeModal from '../components/shared/UpgradeModal';
import { useToast } from '../components/shared/Toast';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        avatar_url: '',
        is_pro_user: false
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                setProfile({
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
                    email: user.email || '',
                    avatar_url: user.user_metadata?.avatar_url || '',
                    is_pro_user: profileData?.is_pro_user || false
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-abacate', {
                body: {
                    user_email: profile.email,
                    user_name: profile.full_name,
                    baseUrl: window.location.origin
                }
            });

            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error('URL de checkout não recebida.');
            }
        } catch (error: any) {
            console.error('Error initiating upgrade:', error);
            showToast(`Erro ao iniciar upgrade: ${error.message}`, 'error');
        } finally {
            setIsUpgrading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);

        try {
            const { error: metadataError } = await supabase.auth.updateUser({
                data: {
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url
                }
            });

            if (metadataError) throw metadataError;

            try {
                await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        full_name: profile.full_name,
                        updated_at: new Date().toISOString()
                    });
            } catch (e) {
                console.warn('Profiles table sync failed, but metadata is updated:', e);
            }

            showToast('Perfil salvo com sucesso!', 'success');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            showToast(`Erro ao salvar perfil: ${error.message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            showToast('A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            showToast(`Erro ao alterar senha: ${error.message}`, 'error');
        } else {
            showToast('Senha alterada com sucesso!', 'success');
            setShowPasswordModal(false);
            setNewPassword('');
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Gera um preview local enquanto sobe
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                setProfile(prev => ({ ...prev, avatar_url: ev.target!.result as string }));
            }
        };
        reader.readAsDataURL(file);
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
                        <h1 className="font-bold text-text-main text-lg tracking-tight">Meu Perfil</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Salvando...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Salvar Alterações</span>
                            </>
                        )}
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-4xl mx-auto space-y-8 pb-10">
                        {/* Profile Hero */}
                        <div className="bg-white rounded-3xl p-8 border border-border-light shadow-sm flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="size-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all bg-primary/10 flex items-center justify-center">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-black text-primary">{initials}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                    <Camera size={16} />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                />
                            </div>
                            <div className="text-center md:text-left space-y-2">
                                <h2 className="text-3xl font-black text-text-main">{profile.full_name || 'Seu Nome'}</h2>
                                <p className="text-text-muted font-medium flex items-center justify-center md:justify-start gap-2">
                                    <Mail size={16} />
                                    {profile.email}
                                </p>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${profile.is_pro_user ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {profile.is_pro_user ? 'Plano Pro' : 'Plano Grátis'}
                                    </span>
                                    {!profile.is_pro_user && (
                                        <button
                                            onClick={() => setIsUpgradeModalOpen(true)}
                                            className="text-primary text-xs font-bold hover:underline transition-all"
                                        >
                                            Fazer Upgrade
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Settings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-3xl p-8 border border-border-light shadow-sm space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <User size={22} className="text-primary" />
                                    Informações Pessoais
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Nome Completo</label>
                                        <input
                                            type="text"
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                            placeholder="Digite seu nome completo"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">E-mail</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-gray-50 text-text-muted cursor-not-allowed font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 border border-border-light shadow-sm space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <Shield size={22} className="text-primary" />
                                    Segurança e Assinatura
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl border border-blue-50 bg-blue-50/30 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Bot size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">GupyAI Pro</p>
                                                <p className="text-[10px] text-text-muted font-bold uppercase">Assinatura Mensal</p>
                                            </div>
                                        </div>
                                        {!profile.is_pro_user ? (
                                            <span
                                                onClick={() => setIsUpgradeModalOpen(true)}
                                                className="text-xs font-bold text-primary cursor-pointer hover:underline"
                                            >
                                                Assinar
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-green-600">✔ Ativa</span>
                                        )}
                                    </div>

                                    {/* Botão Alterar Senha */}
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="w-full py-3 px-4 rounded-xl border border-border-light font-bold text-sm hover:bg-gray-50 transition-all text-text-main"
                                    >
                                        Alterar Senha
                                    </button>

                                    {/* Modal Alterar Senha */}
                                    {showPasswordModal && (
                                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
                                                <h4 className="font-bold text-text-main text-lg">Nova Senha</h4>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Mínimo 6 caracteres"
                                                    className="w-full px-4 py-3 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                                <div className="flex gap-3">
                                                    <button onClick={() => { setShowPasswordModal(false); setNewPassword(''); }} className="flex-1 py-2.5 rounded-xl border border-border-light text-sm font-bold text-text-muted hover:bg-gray-50 transition-all">Cancelar</button>
                                                    <button onClick={handleUpdatePassword} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all">Confirmar</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Botão Excluir Conta */}
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full py-3 px-4 rounded-xl border border-red-100 font-bold text-sm text-accent-danger hover:bg-red-50 transition-all"
                                    >
                                        Excluir Minha Conta
                                    </button>

                                    {/* Modal Confirmar Exclusão */}
                                    {showDeleteConfirm && (
                                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
                                                <h4 className="font-bold text-red-700 text-lg">⚠️ Excluir Conta</h4>
                                                <p className="text-sm text-text-muted">Esta ação é irreversível. Todos seus dados serão perdidos.</p>
                                                <div className="flex gap-3">
                                                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-border-light text-sm font-bold text-text-muted hover:bg-gray-50 transition-all">Cancelar</button>
                                                    <button onClick={() => { setShowDeleteConfirm(false); showToast('Solicitação registrada. Entre em contato com o suporte.', 'info'); }} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">Confirmar</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgrade={handleUpgrade}
                isSubmitting={isUpgrading}
            />
        </div>
    );
};

export default ProfilePage;
