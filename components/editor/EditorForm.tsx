
import React from 'react';
import { ChevronUp, ChevronDown, User, FileText, Briefcase, GraduationCap, PlusCircle, Bot, X } from 'lucide-react';
import type { ResumeData, Experience, Education } from '../../pages/EditorPage';

interface AccordionSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    return (
        <section className="bg-white rounded-xl border border-border-light overflow-hidden transition-all hover:border-blue-200 hover:shadow-soft group">
            <div onClick={() => setIsOpen(!isOpen)} className="bg-slate-50 px-5 py-3 border-b border-border-light flex justify-between items-center cursor-pointer">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">{icon} {title}</h3>
                {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </div>
            {isOpen && <div className="p-5">{children}</div>}
        </section>
    );
};

interface EditorFormProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    onApplySuggestion: (suggestion: string) => void;
}

const EditorForm: React.FC<EditorFormProps> = ({ resumeData, setResumeData, onApplySuggestion }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => ({ ...prev, [name]: value }));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experiences: [...prev.experiences, { company: '', position: '', duration: '', bulletPoints: [''] }]
        }));
    };

    const removeExperience = (index: number) => {
        setResumeData(prev => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index)
        }));
    };

    const updateExperience = (index: number, field: keyof Experience, value: any) => {
        setResumeData(prev => {
            const newExps = [...prev.experiences];
            newExps[index] = { ...newExps[index], [field]: value };
            return { ...prev, experiences: newExps };
        });
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { institution: '', degree: '', year: '' }]
        }));
    };

    const removeEducation = (index: number) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const updateEducation = (index: number, field: keyof Education, value: string) => {
        setResumeData(prev => {
            const newEdu = [...prev.education];
            newEdu[index] = { ...newEdu[index], [field]: value };
            return { ...prev, education: newEdu };
        });
    };

    return (
        <div className="w-full lg:w-[55%] flex flex-col h-full border-r border-border-light bg-white z-10">
            {/* Header omitted for brevity in replace_file_content if needed, but let's keep it if small */}
            <div className="px-8 py-6 border-b border-border-light bg-white sticky top-0 z-10">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Editar Currículo</h2>
                        <p className="text-slate-500 text-sm mt-1">Preencha os dados para a IA otimizar seu perfil.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-emerald-600 font-bold text-2xl">85%</span>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Força do Perfil</p>
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-6 space-y-6 pb-20">
                <AccordionSection title="Informações Pessoais" icon={<User className="text-primary" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label><input className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm h-10" type="text" name="name" value={resumeData.name} onChange={handleChange} /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Cargo Pretendido</label><input className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm h-10" type="text" name="jobTitle" value={resumeData.jobTitle} onChange={handleChange} /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm h-10" type="email" name="email" value={resumeData.email} onChange={handleChange} /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label><input className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm h-10" type="tel" name="phone" value={resumeData.phone} onChange={handleChange} /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label><input className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm h-10" type="text" name="linkedin" value={resumeData.linkedin} onChange={handleChange} /></div>
                        <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Localização</label><input className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm h-10" type="text" name="location" value={resumeData.location} onChange={handleChange} /></div>
                    </div>
                </AccordionSection>
                <AccordionSection title="Resumo Profissional" icon={<FileText className="text-primary" />}>
                    <div className="p-0 space-y-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                            <div className="text-primary mt-0.5"><Bot size={20} /></div>
                            <div className="flex-1">
                                <p className="text-sm text-blue-900 font-medium mb-1">Sugestão da IA</p>
                                <p className="text-xs text-blue-800/80 mb-3 leading-relaxed">Detectamos palavras-chave de liderança na vaga alvo. Melhore seu resumo adicionando métricas de gestão.</p>
                                <button
                                    onClick={() => onApplySuggestion("Liderança de squad de 12 desenvolvedores entregando projetos com 15% de economia e foco em KPIs de negócio.")}
                                    className="bg-white text-primary text-xs font-semibold px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                                >
                                    Aplicar Sugestão
                                </button>
                            </div>
                            <button className="text-blue-400 hover:text-blue-600 h-fit"><X size={18} /></button>
                        </div>
                        <div><textarea className="w-full rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-sm p-3 min-h-[120px] leading-relaxed" name="summary" value={resumeData.summary} onChange={handleChange} placeholder="Escreva um breve resumo..."></textarea></div>
                    </div>
                </AccordionSection>
                <AccordionSection title="Experiência Profissional" icon={<Briefcase className="text-primary" />}>
                    <div className="space-y-6">
                        {resumeData.experiences.map((exp, index) => (
                            <div key={index} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
                                <button
                                    onClick={() => removeExperience(index)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X size={16} />
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Empresa</label>
                                        <input className="w-full rounded-lg border-slate-200 text-sm h-9" type="text" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cargo</label>
                                        <input className="w-full rounded-lg border-slate-200 text-sm h-9" type="text" value={exp.position} onChange={(e) => updateExperience(index, 'position', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Duração</label>
                                        <input className="w-full rounded-lg border-slate-200 text-sm h-9" type="text" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addExperience} className="w-full border border-dashed border-slate-300 rounded-lg py-3 text-sm text-slate-500 font-medium hover:border-primary hover:text-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2"><PlusCircle size={16} /> Adicionar Experiência</button>
                    </div>
                </AccordionSection>
                <AccordionSection title="Formação Acadêmica" icon={<GraduationCap className="text-primary" />}>
                    <div className="space-y-6">
                        {resumeData.education.map((edu, index) => (
                            <div key={index} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
                                <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Instituição</label>
                                        <input className="w-full rounded-lg border-slate-200 text-sm h-9" type="text" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Curso</label>
                                            <input className="w-full rounded-lg border-slate-200 text-sm h-9" type="text" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ano</label>
                                            <input className="w-full rounded-lg border-slate-200 text-sm h-9" type="text" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addEducation} className="w-full border border-dashed border-slate-300 rounded-lg py-3 text-sm text-slate-500 font-medium hover:border-primary hover:text-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2"><PlusCircle size={16} /> Adicionar Formação</button>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
};

export default EditorForm;
