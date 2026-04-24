import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Desplegable premium con estética Monza (dark, acento rojo, chevron animado).
 *
 * Es la misma UI que ya se usaba en `VehicleSelector` (página principal) — acá se
 * extrajo para poder reutilizarla en otros lugares (Catálogo) manteniendo consistencia.
 *
 * - `size: 'default'` → tamaño original del home (h-14 md:h-16, text-lg, px-6)
 * - `size: 'compact'` → variante reducida para contextos con menos espacio (h-11, text-sm, px-4)
 */
export interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    disabled?: boolean;
    className?: string;
    size?: 'default' | 'compact';
    /** Texto que se muestra cuando no hay opciones (ej. cuando un select depende de otro) */
    emptyText?: string;
}

export function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
    disabled,
    className,
    size = 'default',
    emptyText = 'No hay opciones disponibles',
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    const isCompact = size === 'compact';

    return (
        <div className={clsx('relative', className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={clsx(
                    'w-full bg-carbon-800 border rounded-xl text-left flex items-center justify-between transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-monza-red/50',
                    isCompact ? 'h-11 px-4' : 'h-14 md:h-16 px-6',
                    isOpen ? 'border-monza-red ring-1 ring-monza-red/50' : 'border-white/10 hover:border-white/20',
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-carbon-700'
                )}
            >
                <span
                    className={clsx(
                        'font-medium truncate',
                        isCompact ? 'text-sm' : 'text-lg',
                        value ? 'text-white' : 'text-gray-500'
                    )}
                >
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={clsx(
                        'text-gray-400 transition-transform duration-300 shrink-0',
                        isCompact ? 'w-4 h-4 ml-2' : 'w-5 h-5 ml-3',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto bg-carbon-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 scrollbar-thin scrollbar-thumb-monza-red scrollbar-track-carbon-800/50"
                        data-lenis-prevent
                    >
                        {options.length > 0 ? (
                            <div className={clsx(isCompact ? 'py-1' : 'py-2')}>
                                {options.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={clsx(
                                            'w-full text-left transition-colors flex items-center justify-between group',
                                            'hover:bg-monza-red hover:text-white',
                                            isCompact ? 'px-4 py-2 text-sm' : 'px-6 py-3',
                                            value === option ? 'bg-white/5 text-monza-red font-bold' : 'text-gray-300'
                                        )}
                                    >
                                        <span className="truncate">{option}</span>
                                        {value === option && <Check className={clsx(isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4', 'shrink-0 ml-2')} />}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div
                                className={clsx(
                                    'text-center text-gray-500 italic',
                                    isCompact ? 'px-4 py-3 text-xs' : 'px-6 py-4 text-sm'
                                )}
                            >
                                {emptyText}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
