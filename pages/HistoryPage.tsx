
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, ChevronRight, Search, Trash2, Edit3 } from 'lucide-react';
import Sidebar from '../components/shared/Sidebar';
import { supabase } from '../lib/supabaseClient';

interface ResumeHistory {
    id: string;
    resume_data: any;
    created_at: string;
}

const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [history, setHistory] = React.useState<ResumeHistory[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchHistory = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setHistory(data);
            setLoading(false);
        };
        fetchHistory();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta versão?')) return;

        const { error } = await supabase.from('resumes').delete().eq('id', id);
        if (!error) {
            setHistory(prev => prev.filter(h => h.id !== id));
        } else {
            alert('Erro ao excluir: ' + error.message);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-background-light text-text-main h-screen flex overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="font-bold text-text-main text-lg tracking-tight">Meu Histórico</h1>
                    </div>
                    <div className="relative hidden md:block">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar no histórico..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                        />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="text-primary" size={24} />
                                Versões do Currículo
                            </h2>
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{history.length} Versões Salvas</span>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-text-muted font-medium">Carregando histórico...</p>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 border border-border-light border-dashed text-center space-y-4">
                                <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Nenhum currículo encontrado</h3>
                                    <p className="text-text-muted text-sm max-w-xs mx-auto">Comece otimizando seu currículo no Dashboard para ver seu histórico aqui.</p>
                                </div>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                >
                                    Otimizar Agora
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {history.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white border border-border-light rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group flex items-center gap-4"
                                    >
                                        <div className="size-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-text-main group-hover:text-primary transition-colors">
                                                {item.resume_data.name || "Currículo Otimizado"}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-text-muted font-medium mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => {
                                                    localStorage.setItem('last_parsed_resume', JSON.stringify(item.resume_data));
                                                    navigate('/editor');
                                                }}
                                                className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                title="Editar esta versão"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 hover:bg-red-50 text-accent-danger rounded-lg transition-colors"
                                                title="Excluir versão"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <div className="w-[1px] h-6 bg-gray-100 mx-1"></div>
                                            <ChevronRight className="text-gray-300" size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HistoryPage;
