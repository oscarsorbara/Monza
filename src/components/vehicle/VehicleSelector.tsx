import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useVehicle } from '@/context/VehicleContext';
import { useFilteredVehicles } from '@/hooks/useFilteredVehicles';
import clsx from 'clsx';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface VehicleSelectorProps {
    className?: string;
}

export function VehicleSelector({ className }: VehicleSelectorProps) {
    const { selectVehicle, currentVehicle, clearVehicle } = useVehicle();
    const filteredDB = useFilteredVehicles();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

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
        setIsOpen(false);
        navigate('/catalog', { state: { filterByVehicle: true } });
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearVehicle();
        setMake('');
        setModel('');
        setYear('');
    };

    const isComplete = Boolean(year && make && model);

    // --- UI: Sticky Bar / Expandable ---
    return (
        <motion.div
            // Removed backdrop-blur-md to improve scroll performance (GPU heavy)
            className={clsx("w-full bg-carbon-950/95 border-b border-white/10 z-[40] pt-[62px] md:pt-[78px] shadow-2xl", className)}
        >
            <div className="container mx-auto px-4">
                <AnimatePresence mode="wait">
                    {!currentVehicle || isOpen ? (
                        <motion.div
                            key="selector"
                            // If it's the first load (!currentVehicle), show immediately without height animation to avoid "cut" effect
                            initial={!currentVehicle ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="py-8 md:py-10"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white italic uppercase tracking-tighter">BUSCAR PARA TU AUTO</h3>
                                    {!currentVehicle && <span className="hidden md:inline-block text-monza-red text-xs font-bold animate-pulse uppercase tracking-widest bg-monza-red/10 px-2 py-1 rounded">Paso Inicial Requerido</span>}
                                </div>
                                {currentVehicle && (
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                                    >
                                        <X className="text-gray-400 group-hover:text-white w-8 h-8" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Make */}
                                <div className="space-y-2 relative z-30">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider ml-1">Marca</label>
                                    <CustomSelect
                                        value={make}
                                        onChange={(val) => { setMake(val); setModel(''); setYear(''); }}
                                        options={makes}
                                        placeholder="Seleccionar Marca"
                                    />
                                </div>

                                {/* Model */}
                                <div className="space-y-2 relative z-20">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider ml-1">Modelo</label>
                                    <CustomSelect
                                        value={model}
                                        onChange={(val) => { setModel(val); setYear(''); }}
                                        options={models}
                                        placeholder="Seleccionar Modelo"
                                        disabled={!make}
                                    />
                                </div>

                                {/* Year */}
                                <div className="space-y-2 relative z-10">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider ml-1">Año</label>
                                    <CustomSelect
                                        value={year}
                                        onChange={(val) => setYear(val)}
                                        options={years}
                                        placeholder="Seleccionar Año"
                                        disabled={!model}
                                    />
                                </div>

                                {/* Action */}
                                <div className="space-y-2 relative z-0">
                                    <label className="text-xs text-transparent uppercase font-bold tracking-wider ml-1 select-none">Confirmar</label>
                                    <Button
                                        onClick={handleSelect}
                                        disabled={!isComplete}
                                        className="h-14 md:h-16 !bg-monza-red hover:!bg-red-700 !text-white font-black text-xl uppercase tracking-wider w-full shadow-lg shadow-monza-red/20 rounded-xl transform transition-transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Search size={24} />
                                        BUSCAR
                                    </Button>
                                    {!isComplete && year && (
                                        <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500 animate-pulse">Completa todos los campos</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="h-24 flex items-center justify-between gap-4"
                        >
                            {/* Left Side: Vehicle Info */}
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="hidden md:flex flex-col">
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tu Vehículo</span>
                                    <span className="text-monza-red text-xs font-bold animate-pulse">Listo para buscar</span>
                                </div>

                                <div className="flex items-center gap-2 md:gap-3 text-white font-bold bg-white/5 py-3 px-4 md:px-6 rounded-2xl border border-white/10 group hover:border-monza-red transition-colors cursor-default whitespace-nowrap shadow-xl min-w-0 flex-1">
                                    <span className="text-monza-red text-2xl font-black italic hidden md:inline">{currentVehicle.year}</span>
                                    <span className="text-lg md:text-2xl uppercase tracking-tight truncate flex-1 min-w-0">{currentVehicle.make} {currentVehicle.model}</span>
                                    {currentVehicle.engine && currentVehicle.engine !== 'Base' && <span className="text-white/40 text-sm font-medium hidden lg:inline">[{currentVehicle.engine}]</span>}
                                    <button
                                        onClick={handleClear}
                                        className="ml-4 bg-white/10 hover:bg-monza-red rounded-full p-1.5 transition-colors"
                                        title="Quitar vehículo"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Actions */}
                            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                                <Button
                                    onClick={() => navigate('/catalog', { state: { filterByVehicle: true } })}
                                    className="h-12 md:h-14 px-6 md:px-8 !bg-white !text-black hover:!bg-gray-200 font-black italic uppercase tracking-widest shadow-lg shadow-white/10 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Search size={20} />
                                    <span>BUSCAR</span>
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => setIsOpen(true)}
                                    className="h-12 md:h-14 w-12 md:w-auto px-0 md:px-6 border-white/20 hover:bg-white hover:text-black text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="text-2xl font-light leading-none md:mr-1">+</span>
                                    <span className="hidden md:inline">OTRO AUTO</span>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

