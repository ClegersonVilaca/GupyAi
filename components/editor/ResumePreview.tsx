
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import type { ResumeData } from '../../pages/EditorPage';

interface ResumePreviewProps {
    resumeData: ResumeData;
    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    atsMode: boolean;
    setAtsMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, zoom, setZoom, atsMode, setAtsMode }) => {
    return (
        <div className="hidden lg:flex flex-col w-[45%] bg-slate-100 h-full relative overflow-hidden print:w-full print:bg-white print:h-auto print:static">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-200 px-4 py-1.5 gap-4 items-center print:hidden">
                <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                    <button onClick={() => setZoom(prev => Math.max(50, prev - 10))} className="text-slate-500 hover:text-primary p-1 rounded"><ZoomOut size={20} /></button>
                    <span className="text-xs font-semibold text-slate-600 w-8 text-center">{zoom}%</span>
                    <button onClick={() => setZoom(prev => Math.min(200, prev + 10))} className="text-slate-500 hover:text-primary p-1 rounded"><ZoomIn size={20} /></button>
                </div>
                <div className="flex items-center gap-2">
                    <label className="flex items-center cursor-pointer gap-2">
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={atsMode} onChange={() => setAtsMode(!atsMode)} className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                        <span className="text-xs font-medium text-slate-700">Modo ATS</span>
                    </label>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar flex justify-center p-8 pb-20 print:p-0 print:overflow-visible">
                <div
                    className={`bg-white shadow-paper mx-auto p-10 flex flex-col text-slate-800 transition-all origin-top print:shadow-none print:scale-100 print:w-full print:p-0`}
                    style={{
                        fontFamily: atsMode ? "'Arial', sans-serif" : "'Times New Roman', serif",
                        width: "210mm",
                        minHeight: "297mm",
                        transform: `scale(${zoom / 100})`
                    }}
                >
                    <div className={`${atsMode ? 'border-b' : 'border-b-2'} border-slate-800 pb-4 mb-4`}>
                        <h1 className={`${atsMode ? 'text-2xl' : 'text-3xl'} font-bold uppercase tracking-wide text-slate-900 mb-2`}>{resumeData.name || "Nome Completo"}</h1>
                        <div className="text-sm flex flex-wrap gap-x-4 gap-y-1 text-slate-700">
                            <span>{resumeData.location || "Localização"}</span>
                            <span>•</span>
                            <span>{resumeData.phone || "Telefone"}</span>
                            <span>•</span>
                            <span>{resumeData.email || "Email"}</span>
                            <span>•</span>
                            <span>{resumeData.linkedin || "LinkedIn"}</span>
                        </div>
                    </div>

                    <div className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-300 mb-2 pb-1 text-slate-900">Resumo Profissional</h2>
                        <p className="text-sm leading-relaxed text-slate-800 text-justify">{resumeData.summary || "Seu resumo profissional aparecerá aqui."}</p>
                    </div>

                    <div className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-300 mb-2 pb-1 text-slate-900">Experiência Profissional</h2>
                        <div className="space-y-4">
                            {resumeData.experiences.map((exp, i) => (
                                <div key={i} className="mb-3">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base text-slate-900">{exp.company || "Empresa"}</h3>
                                        <span className="text-sm italic text-slate-700">{exp.duration || "Período"}</span>
                                    </div>
                                    <p className="text-sm font-semibold italic text-slate-800 mb-1">{exp.position || "Cargo"}</p>
                                    <ul className="list-disc ml-4 text-sm leading-relaxed text-slate-800 font-sans">
                                        {exp.bulletPoints.map((point, j) => (
                                            <li key={j}>{point || "Descrição da conquista..."}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-300 mb-2 pb-1 text-slate-900">Habilidades Técnicas</h2>
                        <p className="text-sm leading-relaxed text-slate-800 font-sans">
                            <span className="font-bold">Metodologias:</span> Agile, Scrum, Kanban, Lean Startup.<br />
                            <span className="font-bold">Ferramentas:</span> Jira, Confluence, Figma, Google Analytics, SQL.<br />
                            <span className="font-bold">Idiomas:</span> Português (Nativo), Inglês (Fluente).
                        </p>
                    </div>

                    <div className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-300 mb-2 pb-1 text-slate-900">Formação Acadêmica</h2>
                        <div className="space-y-2">
                            {resumeData.education.map((edu, i) => (
                                <div key={i} className="flex justify-between items-baseline">
                                    <div h-fit>
                                        <h3 className="font-bold text-sm text-slate-900">{edu.institution || "Instituição"}</h3>
                                        <p className="text-sm text-slate-800">{edu.degree || "Curso"}</p>
                                    </div>
                                    <span className="text-sm italic text-slate-700">{edu.year || "Ano"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none print:hidden"></div>
        </div>
    );
};

export default ResumePreview;
