
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => { } });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    let counter = 0;

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++counter;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const icons = {
        success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
        error: <XCircle size={18} className="text-red-500 shrink-0" />,
        info: <AlertCircle size={18} className="text-blue-500 shrink-0" />,
    };

    const colors = {
        success: 'border-green-100 bg-green-50',
        error: 'border-red-100 bg-red-50',
        info: 'border-blue-100 bg-blue-50',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl shadow-black/10 pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-300 ${colors[toast.type]}`}
                    >
                        {icons[toast.type]}
                        <p className="text-sm font-medium text-gray-800 leading-snug flex-1">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
