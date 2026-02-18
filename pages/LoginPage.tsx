
import React from 'react';
import { Mail, Eye, Bot, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login and redirect to dashboard
        navigate('/dashboard');
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
                        <h1 className="text-3xl font-bold tracking-tight text-text-main">Welcome back</h1>
                        <p className="text-text-muted">Log in to optimize your resume for Gupy's algorithm.</p>
                    </div>
                    <div className="bg-surface-light rounded-2xl shadow-sm border border-border-light p-6 sm:p-8">
                        <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-text-main border border-border-light font-medium h-12 rounded-lg transition-colors focus:ring-4 focus:ring-primary/20 focus:outline-none">
                            <img alt="Google Logo" className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
                            <span>Continue with Google</span>
                        </button>
                        <div className="relative my-6">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-light"></div></div>
                            <div className="relative flex justify-center"><span className="bg-surface-light px-2 text-sm text-text-muted">Or continue with email</span></div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-text-main" htmlFor="email">Email address</label>
                                <div className="relative">
                                    <input className="block w-full h-11 px-4 rounded-lg border-slate-300 bg-white placeholder:text-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all" id="email" name="email" placeholder="you@example.com" required type="email" />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400"><Mail size={18} /></div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-text-main" htmlFor="password">Password</label>
                                    <a className="text-sm font-medium text-primary hover:text-primary-hover" href="#">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <input className="block w-full h-11 px-4 rounded-lg border-slate-300 bg-white placeholder:text-gray-400 focus:border-primary focus:ring-primary sm:text-sm transition-all" id="password" name="password" placeholder="••••••••" required type="password" />
                                    <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600" type="button"><Eye size={18} /></button>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white h-12 rounded-lg font-bold shadow-sm shadow-primary/30 transition-all active:scale-[0.98] focus:ring-4 focus:ring-primary/30 focus:outline-none">
                                    Log In <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-text-muted">Don't have an account?</span>
                            <a className="font-semibold text-primary hover:text-primary-hover ml-1" href="#">Sign up</a>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="py-6 text-center text-xs text-text-muted">
                <p>© 2026 GupyAI. Todos os direitos reservados.</p>
                <div className="mt-2 flex justify-center gap-4">
                    <a className="hover:text-text-main transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-text-main transition-colors" href="#">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
