
import React from 'react';
import { Bot } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleOptimizeClick = () => {
        navigate('/dashboard');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border-light bg-surface-light/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                        <Bot size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-primary">GupyAI</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <button onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Como funciona</button>
                    <button onClick={() => document.getElementById('depoimentos')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Depoimentos</button>
                    <button onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Preços</button>
                </nav>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-primary">Login</Link>
                    <button onClick={handleOptimizeClick} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                        Otimizar Currículo
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
