import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { useVehicle } from '@/context/VehicleContext';
import { useFilteredVehicles } from '@/hooks/useFilteredVehicles';
import { Car, Plus, Trash2, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { CompatibilityStatus } from '@/types';

interface InlineVehicleSelectorProps {
    compatibilityStatus?: CompatibilityStatus;
    /** Render a tighter, lower-height variant suitable for the product page. */
    compact?: boolean;
}

export function InlineVehicleSelector({ compatibilityStatus, compact = false }: InlineVehicleSelectorProps = {}) {
    const { selectVehicle, currentVehicle, clearVehicle } = useVehicle();
    const filteredDB = useFilteredVehicles();
    const [isAddingNew, setIsAddingNew] = useState(false);

    const [year, setYear] = useState<string>('');
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');

    // --- Logic (filtered by products with real compatibility) ---
    const makes = useMemo(() => {
        return Object.keys(filteredDB).sort();
    }, [filteredDB]);

    const models = useMemo(() => {
        if (!make || !filteredDB[make]) return [];
        return Object.keys(filteredDB[make]).sort();
    }, [make, filteredDB]);

    const years = useMemo(() => {
        if (!make || !model || !filteredDB[make]?.[model]) return [];
        return Object.keys(filteredDB[make][model]).sort((a, b) => Number(b) - Number(a));
    }, [make, model, filteredDB]);

    const handleSelect = () => {
        if (!make || !model || !year) return;
        selectVehicle({
            id: `${make}-${model}-${year}`,
            make,
            model,
            year: parseInt(year),
            engine: 'Base',
            variant: 'Base'
        });
        setIsAddingNew(false);
    };

    const handleClear = () => {
        clearVehicle();
    };

    const isComplete = Boolean(year && make && model);
    const showSelector = !currentVehicle || isAddingNew;

    // Compatibility state (only meaningful when a vehicle is set AND we're showing the vehicle card)
    const hasCompatState = !!currentVehicle && !isAddingNew && compatibilityStatus !== undefined;
    const isCompatible = hasCompatState && (compatibilityStatus === 'EXACT_MATCH' || compatibilityStatus === 'UNIVERSAL');
    const isIncompatible = hasCompatState && compatibilityStatus === 'INCOMPATIBLE';

    return (
        <div
            className={clsx(
                "border rounded-2xl transition-colors duration-300",
                compact ? "p-4 md:p-4" : "p-5 md:p-6 mb-6 md:mb-8",
                isCompatible && "bg-green-900/10 border-green-500/40",
                isIncompatible && "bg-red-900/10 border-red-500/40",
                !isCompatible && !isIncompatible && "bg-carbon-900 border-white/10"
            )}
        >
            <div className={clsx("flex items-center gap-2.5", compact ? "mb-3" : "mb-5 md:mb-6 gap-3")}>
                {isCompatible ? (
                    <Check className="text-green-500 shrink-0" size={compact ? 18 : 22} />
                ) : isIncompatible ? (
                    <AlertTriangle className="text-red-500 shrink-0" size={compact ? 18 : 22} />
                ) : (
                    <Car className="text-monza-red shrink-0" size={compact ? 18 : 22} />
                )}
                <h3
                    className={clsx(
                        "font-bold italic uppercase tracking-tighter leading-tight flex-1",
                        compact ? "text-sm md:text-base" : "text-lg md:text-xl",
                        isCompatible && "text-green-400",
                        isIncompatible && "text-red-400",
                        !isCompatible && !isIncompatible && "text-white"
                    )}
                >
                    COMPATIBILIDAD CON TU AUTO
                </h3>
                {isCompatible && (
                    <span className={clsx(
                        "font-black uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/30 rounded-full",
                        compact ? "text-[9px] px-2 py-0.5" : "text-[10px] md:text-xs px-2.5 py-1"
                    )}>
                        Compatible
                    </span>
                )}
                {isIncompatible && (
                    <span className={clsx(
                        "font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/30 rounded-full",
                        compact ? "text-[9px] px-2 py-0.5" : "text-[10px] md:text-xs px-2.5 py-1"
                    )}>
                        No compatible
                    </span>
                )}
            </div>

            <AnimatePresence mode="wait">
                {showSelector ? (
                    <motion.div
                        key="selector"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <div className={clsx("grid grid-cols-1 md:grid-cols-3", compact ? "gap-2.5" : "gap-4")}>
                            {/* Make */}
                            <select
                                value={make}
                                onChange={(e) => { setMake(e.target.value); setModel(''); setYear(''); }}
                                className={clsx(
                                    "bg-carbon-800 border border-white/10 rounded-xl text-white hover:border-white/20 focus:border-monza-red outline-none",
                                    compact ? "h-10 px-3 text-sm" : "h-12 px-4"
                                )}
                            >
                                <option value="">Marca</option>
                                {makes.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>

                            {/* Model */}
                            <select
                                value={model}
                                onChange={(e) => { setModel(e.target.value); setYear(''); }}
                                disabled={!make}
                                className={clsx(
                                    "bg-carbon-800 border border-white/10 rounded-xl text-white hover:border-white/20 focus:border-monza-red outline-none disabled:opacity-30",
                                    compact ? "h-10 px-3 text-sm" : "h-12 px-4"
                                )}
                            >
                                <option value="">Modelo</option>
                                {models.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>

                            {/* Year */}
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                disabled={!model}
                                className={clsx(
                                    "bg-carbon-800 border border-white/10 rounded-xl text-white hover:border-white/20 focus:border-monza-red outline-none disabled:opacity-30",
                                    compact ? "h-10 px-3 text-sm" : "h-12 px-4"
                                )}
                            >
                                <option value="">Año</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>

                        <div className={clsx("flex", compact ? "gap-2 mt-3" : "gap-3")}>
                            <Button
                                onClick={handleSelect}
                                disabled={!isComplete}
                                className={clsx(
                                    "flex-1 bg-monza-red hover:bg-white hover:text-black text-white font-bold uppercase tracking-wider rounded-xl",
                                    compact ? "h-10 text-sm" : "h-12"
                                )}
                            >
                                VERIFICAR COMPATIBILIDAD
                            </Button>
                            {isAddingNew && currentVehicle && (
                                <Button
                                    onClick={() => setIsAddingNew(false)}
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="vehicle-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={clsx(
                            "rounded-xl border flex flex-row justify-between items-center gap-3 transition-colors duration-300",
                            compact ? "p-2.5" : "p-4 flex-col md:flex-row gap-4",
                            isCompatible && "bg-green-500/5 border-green-500/25",
                            isIncompatible && "bg-red-500/5 border-red-500/25",
                            !isCompatible && !isIncompatible && "bg-white/5 border-white/10"
                        )}
                    >
                        <div className={clsx("flex items-center min-w-0", compact ? "gap-3" : "gap-4 w-full md:w-auto")}>
                            <div
                                className={clsx(
                                    "rounded-full shrink-0",
                                    compact ? "p-2" : "p-3",
                                    isCompatible && "bg-green-500/20",
                                    isIncompatible && "bg-red-500/20",
                                    !isCompatible && !isIncompatible && "bg-monza-red/20"
                                )}
                            >
                                <Car
                                    className={clsx(
                                        isCompatible && "text-green-400",
                                        isIncompatible && "text-red-400",
                                        !isCompatible && !isIncompatible && "text-monza-red"
                                    )}
                                    size={compact ? 18 : 24}
                                />
                            </div>
                            <div className="min-w-0">
                                <p
                                    className={clsx(
                                        "font-bold uppercase tracking-wider",
                                        compact ? "text-[10px]" : "text-xs",
                                        isCompatible && "text-green-400",
                                        isIncompatible && "text-red-400",
                                        !isCompatible && !isIncompatible && "text-gray-400"
                                    )}
                                >
                                    {isCompatible ? 'Vehículo Compatible' : isIncompatible ? 'No compatible' : 'Vehículo Seleccionado'}
                                </p>
                                <p className={clsx("font-bold text-white truncate", compact ? "text-sm md:text-base" : "text-lg md:text-xl")}>{currentVehicle?.year} {currentVehicle?.make} {currentVehicle?.model}</p>
                            </div>
                        </div>

                        <div className={clsx("flex items-center", compact ? "gap-1 shrink-0" : "gap-2 w-full md:w-auto")}>
                            <Button
                                onClick={() => setIsAddingNew(true)}
                                variant="outline"
                                size="sm"
                                className={clsx(
                                    "border-white/20 hover:bg-white hover:text-black font-bold uppercase",
                                    compact ? "text-[10px] h-8 px-2.5" : "flex-1 md:flex-initial text-xs"
                                )}
                            >
                                <Plus size={compact ? 12 : 14} className="mr-1" /> Nuevo
                            </Button>
                            <Button
                                onClick={handleClear}
                                variant="ghost"
                                size="sm"
                                className={clsx(
                                    "text-red-500 hover:bg-red-500/10 hover:text-red-400",
                                    compact ? "p-1.5 h-8 w-8" : "p-2"
                                )}
                                title="Eliminar vehículo"
                            >
                                <Trash2 size={compact ? 14 : 18} />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
