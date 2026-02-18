
import React, { useState } from 'react';
import { FileText, FileUp, Bot, X } from 'lucide-react';

interface JobInputSectionProps {
    file: File | null;
    setFile: (file: File | null) => void;
    onOptimize: () => void;
    isOptimizing: boolean;
}

const JobInputSection: React.FC<JobInputSectionProps> = ({ file, setFile, onOptimize, isOptimizing }) => {
    const [jobDescription, setJobDescription] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const removeFile = () => setFile(null);

    return (
        <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-4 hide-scrollbar">
            <div>
                <h1 className="text-2xl font-bold text-text-main mb-2">Otimizar Currículo</h1>
                <p className="text-text-muted text-sm leading-relaxed">Preencha os dados abaixo para que nossa IA analise a compatibilidade do seu perfil com a vaga desejada.</p>
            </div>

            <div className="bg-surface-light rounded-2xl shadow-sm border border-border-light p-6 flex flex-col gap-6 flex-1">
                <div className="flex flex-col gap-2 flex-1 min-h-[250px]">
                    <label className="text-sm font-semibold text-text-main flex items-center gap-2" htmlFor="job-desc">
                        <FileText className="text-primary" size={18} />
                        Descrição da Vaga
                    </label>
                    <textarea
                        className="w-full flex-1 rounded-xl border-border-light bg-gray-50 text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none p-4 text-sm leading-relaxed placeholder:text-gray-400 transition-all"
                        id="job-desc"
                        placeholder="Cole a descrição completa da vaga aqui (requisitos, responsabilidades, etc)..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                        <FileUp className="text-primary" size={18} />
                        Seu Currículo (PDF)
                    </label>

                    <div className="relative group cursor-pointer">
                        <input
                            accept=".pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <div className="border-2 border-dashed border-primary/20 group-hover:border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all bg-gray-50 group-hover:bg-primary/5">
                            <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary group-hover:scale-110 transition-transform">
                                <FileUp size={24} />
                            </div>
                            <p className="text-sm font-medium text-text-main">Clique para carregar ou arraste o arquivo</p>
                            <p className="text-xs text-text-muted mt-1">PDF até 5MB</p>
                        </div>
                    </div>

                    {file ? (
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-text-main truncate">{file.name}</p>
                                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="p-2 text-text-muted hover:text-accent-danger transition-colors hover:bg-red-50 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ) : null}
                </div>

                <button
                    onClick={onOptimize}
                    disabled={isOptimizing}
                    className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group mt-auto"
                >
                    {isOptimizing ? (
                        <>
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Analisando...
                        </>
                    ) : (
                        <>
                            <Bot className="group-hover:animate-pulse" size={20} />
                            Otimizar Currículo
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default JobInputSection;
