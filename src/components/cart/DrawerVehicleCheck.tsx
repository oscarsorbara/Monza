import { useState, useMemo } from 'react';
import { Car, Search } from 'lucide-react';
import { useVehicle } from '@/context/VehicleContext';
import { useFilteredVehicles } from '@/hooks/useFilteredVehicles';

/**
 * Compact vehicle check prompt shown inside the cart drawer
 * when there are items in the cart but no vehicle has been selected.
 * Once the user completes make/model/year, selectVehicle is called and
 * this component unmounts in favor of CartUpsell.
 */
export function DrawerVehicleCheck() {
    const { selectVehicle } = useVehicle();
    const filteredDB = useFilteredVehicles();

    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');

    const makes = useMemo(() => Object.keys(filteredDB).sort(), [filteredDB]);

    const models = useMemo(() => {
        if (!make || !filteredDB[make]) return [];
        return Object.keys(filteredDB[make]).sort();
    }, [make, filteredDB]);

    const years = useMemo(() => {
        if (!make || !model || !filteredDB[make]?.[model]) return [];
        return Object.keys(filteredDB[make][model]).sort((a, b) => Number(b) - Number(a));
    }, [make, model, filteredDB]);

    const isComplete = Boolean(make && model && year);

    const handleConfirm = () => {
        if (!isComplete) return;
        selectVehicle({
            id: `${make}-${model}-${year}`,
            make,
            model,
            year: parseInt(year),
            engine: 'Base',
            variant: 'Base'
        });
    };

    return (
        <section
            className="mt-6 pt-5 border-t border-white/5"
            aria-label="Verificar compatibilidad de vehículo"
        >
            <div className="flex items-center gap-2 mb-2">
                <Car className="w-4 h-4 text-monza-red shrink-0" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                    ¿Cuál es tu auto?
                </h4>
            </div>
            <p className="text-xs md:text-[13px] text-gray-400 mb-4 leading-snug">
                Revisá si tu vehículo es compatible para ver productos relacionados.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <select
                    value={make}
                    onChange={(e) => { setMake(e.target.value); setModel(''); setYear(''); }}
                    className="h-11 bg-carbon-900 border border-white/10 rounded-xl px-3 text-sm text-white focus:border-monza-red focus:outline-none"
                >
                    <option value="">Marca</option>
                    {makes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                <select
                    value={model}
                    onChange={(e) => { setModel(e.target.value); setYear(''); }}
                    disabled={!make}
                    className="h-11 bg-carbon-900 border border-white/10 rounded-xl px-3 text-sm text-white focus:border-monza-red focus:outline-none disabled:opacity-40"
                >
                    <option value="">Modelo</option>
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={!model}
                    className="h-11 bg-carbon-900 border border-white/10 rounded-xl px-3 text-sm text-white focus:border-monza-red focus:outline-none disabled:opacity-40"
                >
                    <option value="">Año</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            <button
                onClick={handleConfirm}
                disabled={!isComplete}
                className="w-full h-11 rounded-xl bg-white text-black font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Search size={16} />
                Verificar compatibilidad
            </button>
        </section>
    );
}
