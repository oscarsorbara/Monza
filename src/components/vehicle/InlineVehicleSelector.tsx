import { useState, useMemo } from 'react';
import { VEHICLE_DATABASE } from '@/data/vehiclesMock';
import { Button } from '@/components/ui/Button';
import { useVehicle } from '@/context/VehicleContext';
import { Car, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InlineVehicleSelector() {
    const { selectVehicle, currentVehicle, clearVehicle } = useVehicle();
    const [isAddingNew, setIsAddingNew] = useState(false);

    const [year, setYear] = useState<string>('');
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [submodel, setSubmodel] = useState<string>('');

    // --- Logic Reuse (Ideal to extract hook, but duplicated for safety/speed now) ---
    const years = useMemo(() => {
        const yearSet = new Set<string>();
        Object.values(VEHICLE_DATABASE).forEach(models => {
            Object.values(models).forEach(yearsObj => {
                Object.keys(yearsObj).forEach(y => yearSet.add(y));
            });
        });
        return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
    }, []);

    const makes = useMemo(() => {
        if (!year) return [];
        return Object.keys(VEHICLE_DATABASE).filter(brand => {
            return Object.values(VEHICLE_DATABASE[brand]).some(modelObj =>
                Object.keys(modelObj).includes(year)
            );
        }).sort();
    }, [year]);

    const models = useMemo(() => {
        if (!year || !make) return [];
        const modelsObj = VEHICLE_DATABASE[make];
        return Object.keys(modelsObj).filter(m =>
            Object.keys(modelsObj[m]).includes(year)
        ).sort();
    }, [year, make]);

    const handleSelect = () => {
        if (!make || !model || !year) return;
        selectVehicle({
            id: `${make}-${model}-${year}`,
            make,
            model,
            year: parseInt(year),
            engine: submodel || 'Base'
        });
        setIsAddingNew(false);
    };

    const handleClear = () => {
        clearVehicle();
    };

    const isComplete = Boolean(year && make && model);

    // Render Mode
    const showSelector = !currentVehicle || isAddingNew;

    return (
        <div className="bg-carbon-900 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <Car className="text-monza-red" size={24} />
                <h3 className="text-xl font-bold text-white italic uppercase tracking-tighter">
                    COMPATIBILIDAD CON TU AUTO
                </h3>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Year */}
                            <select
                                value={year}
                                onChange={(e) => { setYear(e.target.value); setMake(''); setModel(''); }}
                                className="h-12 bg-carbon-800 border border-white/10 rounded-xl px-4 text-white hover:border-white/20 focus:border-monza-red outline-none"
                            >
                                <option value="">Año</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>

                            {/* Make */}
                            <select
                                value={make}
                                onChange={(e) => { setMake(e.target.value); setModel(''); }}
                                disabled={!year}
                                className="h-12 bg-carbon-800 border border-white/10 rounded-xl px-4 text-white hover:border-white/20 focus:border-monza-red outline-none disabled:opacity-30"
                            >
                                <option value="">Marca</option>
                                {makes.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>

                            {/* Model */}
                            <select
                                value={model}
                                onChange={(e) => { setModel(e.target.value); setSubmodel(''); }}
                                disabled={!make}
                                className="h-12 bg-carbon-800 border border-white/10 rounded-xl px-4 text-white hover:border-white/20 focus:border-monza-red outline-none disabled:opacity-30"
                            >
                                <option value="">Modelo</option>
                                {models.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleSelect}
                                disabled={!isComplete}
                                className="flex-1 bg-monza-red hover:bg-white hover:text-black text-white font-bold uppercase tracking-wider h-12 rounded-xl"
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
                        className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-monza-red/20 p-3 rounded-full">
                                <Car className="text-monza-red" size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Vehículo Seleccionado</p>
                                <p className="text-xl font-bold text-white">{currentVehicle?.year} {currentVehicle?.make} {currentVehicle?.model}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button
                                onClick={() => setIsAddingNew(true)}
                                variant="outline"
                                size="sm"
                                className="flex-1 md:flex-initial border-white/20 hover:bg-white hover:text-black text-xs font-bold uppercase"
                            >
                                <Plus size={14} className="mr-1" /> Nuevo
                            </Button>
                            <Button
                                onClick={handleClear}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:bg-red-500/10 hover:text-red-400 p-2"
                                title="Eliminar vehículo"
                            >
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
