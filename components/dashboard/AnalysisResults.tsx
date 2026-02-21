
import React from 'react';
import { BarChart2, AlertTriangle, BadgeCheck, Lightbulb, FilePenLine, Languages, ChevronRight, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScoreGauge from './ScoreGauge';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import type { AnalysisData } from '../../pages/DashboardPage';

interface AnalysisResultsProps {
    data: AnalysisData;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
    const navigate = useNavigate();
    const [isExporting, setIsExporting] = React.useState(false);

    const handleSuggestionClick = (suggestion: any) => {
        if (suggestion.type === 'content') {
            localStorage.setItem('pending_suggestion', JSON.stringify(suggestion));
        }
        navigate('/editor');
    };

    // Use provided data
    const score = data?.score ?? 0;
    const hardSkills = data?.hardSkills ?? 0;
    const softSkills = data?.softSkills ?? 0;
    const keywordsMatch = data?.keywordsMatch ?? "0%";
    const formattingScore = data?.formattingScore ?? 0;
    const missingKeywords = data?.missingKeywords ?? [];
    const strengths = data?.strengths ?? [];
    const suggestions = data?.suggestions ?? [];

    const handleExportReport = async () => {
        const element = document.getElementById('analysis-report');
        if (!element) return;

        setIsExporting(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Relatório_GupyAI_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Erro ao exportar PDF. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-border-light h-full flex flex-col overflow-hidden">
            <style>{`
                @media print {
                    aside, header, button, .shrink-0, hr, .print\\:hidden { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                    .bg-background-light { background: white !important; }
                    .shadow-xl, .shadow-sm { shadow: none !important; }
                    .custom-scrollbar { overflow: visible !important; height: auto !important; }
                    .bg-white { border: none !important; }
                }
            `}</style>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 print:hidden">
                <div>
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                        <BarChart2 className="text-primary" size={20} />
                        Análise de Compatibilidade
                    </h3>
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Baseado no algoritmo da Gupy</p>
                </div>
                <button
                    onClick={handleExportReport}
                    disabled={isExporting}
                    className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                    {isExporting ? 'EXPORTANDO...' : 'EXPORTAR RELATÓRIO'}
                </button>
            </div>

            <div id="analysis-report" className="overflow-y-auto p-6 flex-1 space-y-8 custom-scrollbar bg-white">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    <ScoreGauge score={score} />
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-hover hover:border-primary/20">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="size-2 rounded-full bg-accent-success"></div>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Competências Técnicas</span>
                            </div>
                            <p className="text-2xl font-black text-text-main">{hardSkills}/10</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-hover hover:border-primary/20">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="size-2 rounded-full bg-accent-warning"></div>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Habilidades Interpessoais</span>
                            </div>
                            <p className="text-2xl font-black text-text-main">{softSkills}/10</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-hover hover:border-primary/20">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="size-2 rounded-full bg-accent-danger"></div>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Palavras-chave</span>
                            </div>
                            <p className="text-2xl font-black text-text-main">{keywordsMatch}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-hover hover:border-primary/20">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="size-2 rounded-full bg-primary"></div>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Formatação ATS</span>
                            </div>
                            <p className="text-2xl font-black text-text-main">{formattingScore}%</p>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                        <h4 className="font-bold text-accent-danger flex items-center gap-2 mb-4">
                            <AlertTriangle size={20} />
                            Palavras-chave Faltantes
                        </h4>
                        <ul className="space-y-3">
                            {missingKeywords.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-red-100 shadow-sm transition-transform hover:scale-[1.02]">
                                    <X className="text-accent-danger mt-0.5 shrink-0" size={16} />
                                    <div>
                                        <p className="text-sm font-bold text-text-main">{item.title}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{item.sub}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
                        <h4 className="font-bold text-accent-success flex items-center gap-2 mb-4">
                            <BadgeCheck size={20} />
                            Pontos Fortes Detectados
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                            {strengths.map((skill: string) => (
                                <span key={skill} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-accent-success border border-green-100 shadow-sm transition-hover hover:shadow-md">
                                    <CheckCircle size={14} /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-text-main flex items-center gap-2">
                        <Lightbulb className="text-primary" size={20} />
                        Sugestões de Melhoria da IA
                    </h4>

                    {suggestions.map((sug, i) => (
                        <div
                            key={i}
                            onClick={() => handleSuggestionClick(sug)}
                            className="bg-white border border-border-light rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer group flex gap-4"
                        >
                            <div className="shrink-0">
                                <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    {sug.icon || <FilePenLine size={20} />}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h5 className="font-bold text-text-main text-sm mb-1">{sug.title}</h5>
                                <p className="text-xs text-text-muted leading-relaxed font-medium">{sug.desc}</p>
                            </div>
                            <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                <ChevronRight className="text-primary" size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default AnalysisResults;
