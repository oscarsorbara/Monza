

// We will use 'sonner' library as it's the standard for modern React toasts.
// But first I need to install it. I'll add the install command in the next step.
// For now, I will write the wrapper component assuming it's installed or implement a simple custom one if prefer not to install more deps.
// Given "Standard" instructions, I should probably stick to simple implementation or install standard lib.
// Let's implement a simple Context-based Toast to avoid extra dependencies if possible, but sonner is better.
// Actually, I'll implement a custom simple one to be dependency-free.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {createPortal(
                <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
                    {toasts.map((t) => (
                        <div
                            key={t.id}
                            className={`min-w-[300px] p-4 rounded-lg shadow-lg border flex items-center gap-3 animate-fade-in transition-all ${t.type === 'success' ? 'bg-carbon-800 border-green-500/50 text-white' :
                                t.type === 'error' ? 'bg-carbon-800 border-red-500/50 text-white' :
                                    'bg-carbon-800 border-blue-500/50 text-white'
                                }`}
                        >
                            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                            {t.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}

                            <span className="text-sm font-medium flex-1">{t.message}</span>

                            <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
}
