
import React from 'react';
import { Mail, Eye, Bot, ArrowRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [isSignUp, setIsSignUp] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });
                if (error) throw error;
                alert('Conta criada com sucesso! Verifique seu email para confirmar o cadastro ou faça login.');
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    if (error.message === 'Invalid login credentials') {
                        throw new Error('Email ou senha incorretos. Você já tem uma conta? Se não, clique em Cadastre-se.');
                    }
                    throw error;
                }
                navigate('/dashboard');
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard'
                }
            });
            if (error) throw error;
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="bg-background-light font-sans antialiased min-h-screen flex flex-col">
            <header className="w-full px-6 py-4 flex items-center justify-between sm:justify-start gap-4">
                <Link to="/" className="flex items-center gap-3 text-text-main group">
                    <div className="size-8 text-primary flex items-center justify-center">
                        <Bot size={32} />
                    </div>
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-text-main">GupyAI</h2>
                </Link>
                <div className="flex-1"></div>
                <Link to="/" className="text-sm font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1 group">
                    <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Voltar para Home
                </Link>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-[440px] flex flex-col gap-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-text-main">
                            {isSignUp ? 'Crie sua conta' : 'Bem-vindo de volta'}
                        </h1>
                        <p className="text-text-muted">
                            {isSignUp ? 'Comece a otimizar seu currículo hoje.' : 'Entre para otimizar seu currículo para o algoritmo da Gupy.'}
                        </p>
                    </div>
                    <div className="bg-surface-light rounded-2xl shadow-sm border border-border-light p-6 sm:p-8">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-text-main border border-border-light font-medium h-12 rounded-lg transition-colors focus:ring-4 focus:ring-primary/20 focus:outline-none"
                        >
                            <img alt="Google Logo" className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
                            <span>Continue com Google</span>
                        </button>
                        <div className="relative my-6">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-light"></div></div>
                            <div className="relative flex justify-center">
                                <span className="bg-surface-light px-2 text-sm text-text-muted">
                                    {isSignUp ? 'Ou cadastre-se com email' : 'Ou continue com email'}
                                </span>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isSignUp && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <label className="block text-sm font-medium text-text-main" htmlFor="name">Nome Completo</label>
                                    <div className="relative">
                                        <input
                                            className="block w-full h-11 px-4 rounded-lg border-slate-300 bg-white placeholder:text-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all"
                                            id="name"
                                            name="name"
                                            placeholder="Seu nome"
                                            required
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400"><User className="size-4.5" size={18} /></div>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-text-main" htmlFor="email">Email</label>
                                <div className="relative">
                                    <input
                                        className="block w-full h-11 px-4 rounded-lg border-slate-300 bg-white placeholder:text-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all"
                                        id="email"
                                        name="email"
                                        placeholder="seu@email.com"
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400"><Mail size={18} /></div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-text-main" htmlFor="password">Senha</label>
                                    {!isSignUp && <a className="text-sm font-medium text-primary hover:text-primary-hover" href="#">Esqueceu a senha?</a>}
                                </div>
                                <div className="relative">
                                    <input
                                        className="block w-full h-11 px-4 rounded-lg border-slate-300 bg-white placeholder:text-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white h-12 rounded-lg font-bold shadow-sm shadow-primary/30 transition-all active:scale-[0.98] focus:ring-4 focus:ring-primary/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (isSignUp ? 'Cadastrando...' : 'Entrando...') : (isSignUp ? 'Criar Conta' : 'Entrar')} <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-text-muted">
                                {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                            </span>
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="font-semibold text-primary hover:text-primary-hover ml-1"
                            >
                                {isSignUp ? 'Faça Login' : 'Cadastre-se'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="py-6 text-center text-xs text-text-muted">
                <p>© 2026 GupyAI. Todos os direitos reservados.</p>
                <div className="mt-2 flex justify-center gap-4">
                    <a className="hover:text-text-main transition-colors" href="#">Política de Privacidade</a>
                    <a className="hover:text-text-main transition-colors" href="#">Termos de Serviço</a>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
