
import { useState, useMemo, useEffect } from 'react';
import { useProduct } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { X, Car, Check, SlidersHorizontal, Search, Plus } from 'lucide-react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useVehicle } from '@/context/VehicleContext';
import { useFilteredVehicles } from '@/hooks/useFilteredVehicles';
import { checkCompatibility } from '@/lib/compatibility';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/FadeIn';
import type { Vehicle } from '@/types';

// Normaliza strings para búsqueda: minúsculas + sin tildes
const normalizeForSearch = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function Catalog() {
    const { products, collections } = useProduct();
    const { currentVehicle, selectVehicle, garage, removeVehicleFromGarage } = useVehicle();
    const filteredDB = useFilteredVehicles();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // --- Filters State ---
    const [isVehicleFilterActive, setIsVehicleFilterActive] = useState(() => {
        return location.state?.filterByVehicle ?? false;
    });

    const makeFilter = searchParams.get('make');
    const collectionFilter = searchParams.get('collection');

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- Vehicle Inline Selector (para agregar nuevo auto) ---
    const [selMake, setSelMake] = useState('');
    const [selModel, setSelModel] = useState('');
    const [selYear, setSelYear] = useState('');
    // Controla si se está agregando un auto adicional cuando ya hay autos en el garage
    const [isAddingNew, setIsAddingNew] = useState(false);

    const availableMakes = useMemo(() => Object.keys(filteredDB).sort(), [filteredDB]);
    const availableModels = useMemo(() => {
        if (!selMake || !filteredDB[selMake]) return [];
        return Object.keys(filteredDB[selMake]).sort();
    }, [selMake, filteredDB]);
    const availableYears = useMemo(() => {
        if (!selMake || !selModel || !filteredDB[selMake]?.[selModel]) return [];
        return Object.keys(filteredDB[selMake][selModel]).sort((a, b) => Number(b) - Number(a));
    }, [selMake, selModel, filteredDB]);

    const canApplyVehicle = Boolean(selMake && selModel && selYear);

    const handleApplyVehicle = () => {
        if (!canApplyVehicle) return;
        selectVehicle({
            id: `${selMake}-${selModel}-${selYear}`,
            make: selMake,
            model: selModel,
            year: parseInt(selYear),
            engine: 'Base',
            variant: 'Base',
        });
        setIsVehicleFilterActive(true);
        setSelMake('');
        setSelModel('');
        setSelYear('');
        setIsAddingNew(false);
    };

    // Switch entre autos del garage (no duplica, solo cambia el activo)
    const handleSwitchVehicle = (vehicle: Vehicle) => {
        if (currentVehicle?.id === vehicle.id) return;
        selectVehicle(vehicle);
        setIsVehicleFilterActive(true);
    };

    // Borra un auto específico del garage. Si era el activo, el useEffect de abajo re-asigna otro.
    const handleRemoveVehicle = (id: string) => {
        removeVehicleFromGarage(id);
    };

    // Borra todos los autos del garage (con confirmación implícita por ser un botón claro)
    const handleClearAllVehicles = () => {
        // Snapshot de IDs antes de mutar para evitar iterar un array cambiante
        garage.map(v => v.id).forEach(id => removeVehicleFromGarage(id));
        setIsVehicleFilterActive(false);
        setIsAddingNew(false);
    };

    // Auto-select: si se borra el activo pero quedan otros autos, activar el primero automáticamente.
    // Evita estado "garage lleno sin current" que confundiría al usuario.
    useEffect(() => {
        if (!currentVehicle && garage.length > 0) {
            selectVehicle(garage[0]);
        }
    }, [currentVehicle, garage, selectVehicle]);

    // --- Derived Data ---
    // Lista dinámica de marcas: se deriva de las marcas que realmente tienen productos cargados.
    // Evita mostrar marcas sin stock en el sidebar y soporta productos futuros automáticamente.
    const carMakes = useMemo(() => {
        const brandMap = new Map<string, string>(); // key lowercase → display
        products.forEach(p => {
            const list = p.brands && p.brands.length > 0 ? p.brands : (p.brand ? [p.brand] : []);
            list.forEach(b => {
                const name = (b || '').trim();
                if (!name || name.toLowerCase() === 'monza') return; // descartar fallback "Monza"
                const key = name.toLowerCase();
                if (!brandMap.has(key)) brandMap.set(key, name);
            });
        });
        return Array.from(brandMap.values()).sort((a, b) => a.localeCompare(b));
    }, [products]);

    useEffect(() => {
        if (!currentVehicle) setIsVehicleFilterActive(false);
    }, [currentVehicle]);

    // --- Filtering Logic ---
    // Mapa handle → nombre humano de colección (para buscar por "Alerones" y no solo por handle)
    const collectionNameByHandle = useMemo(
        () => Object.fromEntries(collections.map(c => [c.handle, c.name])),
        [collections]
    );

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (currentVehicle && isVehicleFilterActive) {
            result = result.filter(p => {
                const status = checkCompatibility(p, currentVehicle);
                return status === 'EXACT_MATCH' || status === 'UNIVERSAL';
            });
        }

        if (makeFilter) {
            // Case-insensitive match contra TODAS las marcas del producto (brands[]).
            // Fallback a brand si brands no viene cargado.
            const makeKey = makeFilter.toLowerCase();
            result = result.filter(p => {
                const list = p.brands && p.brands.length > 0 ? p.brands : (p.brand ? [p.brand] : []);
                return list.some(b => (b || '').toLowerCase() === makeKey);
            });
        }

        if (collectionFilter) {
            result = result.filter(p => p.collections?.includes(collectionFilter));
        }

        // Búsqueda por nombre: divide la query en tokens; todos deben aparecer en el haystack del producto
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            const tokens = normalizeForSearch(trimmedQuery).split(/\s+/).filter(Boolean);
            result = result.filter(p => {
                const collectionNames = (p.collections ?? [])
                    .map(h => collectionNameByHandle[h] ?? h)
                    .join(' ');
                const brandList = (p.brands && p.brands.length > 0 ? p.brands : [p.brand]).join(' ');
                const haystack = normalizeForSearch(
                    [p.name, brandList, p.category, collectionNames].filter(Boolean).join(' ')
                );
                return tokens.every(t => haystack.includes(t));
            });
        }

        // Sort by Collection (order of collections array from Shopify)
        const collectionRank = Object.fromEntries(collections.map((c, i) => [c.handle, i]));
        result.sort((a, b) => {
            const rankA = a.collections && a.collections.length > 0 ? collectionRank[a.collections[0]] ?? 999 : 999;
            const rankB = b.collections && b.collections.length > 0 ? collectionRank[b.collections[0]] ?? 999 : 999;
            return rankA - rankB;
        });

        return result;
    }, [products, collections, collectionNameByHandle, currentVehicle, isVehicleFilterActive, makeFilter, collectionFilter, searchQuery]);

    // --- Handlers ---
    const updateFilter = (key: 'make' | 'collection', value: string | null) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearAllFilters = () => {
        setSearchParams({});
        setIsVehicleFilterActive(false);
    };

    const hasActiveFilters = makeFilter || collectionFilter || isVehicleFilterActive;

    const renderFilters = () => (
        <div className="space-y-8">
            {hasActiveFilters && (
                <div className="pb-6 border-b border-white/10">
                    <Button
                        onClick={clearAllFilters}
                        variant="ghost"
                        className="w-full justify-start text-gray-400 hover:text-monza-red px-0 h-auto"
                    >
                        <X size={16} className="mr-2" /> Limpiar Filtros
                    </Button>
                </div>
            )}

            <div>
                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Colecciones</h3>
                <div className="space-y-1">
                    <button
                        onClick={() => updateFilter('collection', null)}
                        className={cn(
                            "w-full text-left py-3 md:py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center group",
                            !collectionFilter ? "bg-white text-black font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        Todas
                    </button>
                    {collections.map(coll => (
                        <button
                            key={coll.id}
                            onClick={() => updateFilter('collection', coll.handle === collectionFilter ? null : coll.handle)}
                            className={cn(
                                "w-full text-left py-3 md:py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center group",
                                coll.handle === collectionFilter ? "bg-white text-black font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {coll.name}
                            {coll.handle === collectionFilter && <Check size={14} />}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Marca</h3>
                <div className="space-y-1">
                    <button
                        onClick={() => updateFilter('make', null)}
                        className={cn(
                            "w-full text-left py-3 md:py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center",
                            !makeFilter ? "bg-white text-black font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        Todas
                    </button>
                    {carMakes.map(make => (
                        <button
                            key={make}
                            onClick={() => updateFilter('make', make === makeFilter ? null : make)}
                            className={cn(
                                "w-full text-left py-3 md:py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center",
                                make === makeFilter ? "bg-white text-black font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {make}
                            {make === makeFilter && <Check size={14} />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-4 md:mb-6">
                        CATÁLOGO <span className="text-monza-red">.</span>
                    </h1>

                    {garage.length > 0 ? (
                        <div className="p-4 md:p-5 bg-white/5 border border-white/10 rounded-2xl">
                            {/* Header: título + contador + acciones */}
                            <div className="flex items-center justify-between gap-3 mb-3 md:mb-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Car className={isVehicleFilterActive ? "text-monza-red shrink-0" : "text-gray-400 shrink-0"} size={22} />
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider truncate">
                                        {garage.length > 1 ? `Tus Vehículos (${garage.length})` : 'Tu Vehículo'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {!isAddingNew && (
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingNew(true)}
                                            className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 md:px-3 py-1.5 rounded-full transition-colors"
                                        >
                                            <Plus size={12} /> Agregar
                                        </button>
                                    )}
                                    {garage.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleClearAllVehicles}
                                            className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-monza-red transition-colors"
                                        >
                                            Borrar todos
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Chips de vehículos — click switch activo, X borra */}
                            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                                <AnimatePresence initial={false}>
                                    {garage.map(vehicle => {
                                        const isActive = currentVehicle?.id === vehicle.id;
                                        return (
                                            <motion.div
                                                key={vehicle.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                                onClick={() => !isActive && handleSwitchVehicle(vehicle)}
                                                onKeyDown={(e) => {
                                                    if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                                                        e.preventDefault();
                                                        handleSwitchVehicle(vehicle);
                                                    }
                                                }}
                                                role={isActive ? undefined : "button"}
                                                tabIndex={isActive ? -1 : 0}
                                                aria-pressed={isActive}
                                                aria-label={`${isActive ? 'Vehículo activo' : 'Cambiar a'} ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                className={cn(
                                                    "group flex items-center gap-2 pl-3 pr-1 py-1.5 rounded-full border transition-colors select-none outline-none focus-visible:ring-2 focus-visible:ring-monza-red/60",
                                                    isActive
                                                        ? "bg-monza-red/15 border-monza-red/50 text-white cursor-default"
                                                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white cursor-pointer"
                                                )}
                                            >
                                                {isActive && (
                                                    <span
                                                        className="w-1.5 h-1.5 bg-monza-red rounded-full shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <span className="font-semibold text-[13px] md:text-sm whitespace-nowrap">
                                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveVehicle(vehicle.id);
                                                    }}
                                                    aria-label={`Quitar ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                    title="Quitar"
                                                    className="shrink-0 p-1 rounded-full text-gray-400 hover:text-white hover:bg-monza-red/80 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Botón filtro activo / ver todo */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {!isVehicleFilterActive ? (
                                    <Button
                                        onClick={() => setIsVehicleFilterActive(true)}
                                        size="sm"
                                        className="bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider"
                                    >
                                        Buscar para mi auto
                                    </Button>
                                ) : (
                                    <>
                                        <span className="text-monza-red font-bold text-sm bg-monza-red/10 px-3 py-1.5 rounded-full border border-monza-red/20 animate-pulse">
                                            Filtro Activo
                                        </span>
                                        <Button
                                            onClick={() => setIsVehicleFilterActive(false)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Ver todo
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Selector inline — aparece al apretar "+ Agregar" */}
                            <AnimatePresence initial={false}>
                                {isAddingNew && availableMakes.length > 0 && (
                                    <motion.div
                                        key="add-new-selector"
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-xs text-gray-400 mb-3 font-bold uppercase tracking-wider">Agregar otro vehículo</p>
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-2">
                                                <CustomSelect
                                                    size="compact"
                                                    value={selMake}
                                                    onChange={(val) => { setSelMake(val); setSelModel(''); setSelYear(''); }}
                                                    options={availableMakes}
                                                    placeholder="Marca"
                                                />
                                                <CustomSelect
                                                    size="compact"
                                                    value={selModel}
                                                    onChange={(val) => { setSelModel(val); setSelYear(''); }}
                                                    options={availableModels}
                                                    placeholder="Modelo"
                                                    disabled={!selMake}
                                                    emptyText="Elegí una marca primero"
                                                />
                                                <CustomSelect
                                                    size="compact"
                                                    value={selYear}
                                                    onChange={(val) => setSelYear(val)}
                                                    options={availableYears}
                                                    placeholder="Año"
                                                    disabled={!selModel}
                                                    emptyText="Elegí un modelo primero"
                                                />
                                                <Button
                                                    onClick={handleApplyVehicle}
                                                    disabled={!canApplyVehicle}
                                                    size="sm"
                                                    className="h-11 px-5 bg-monza-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                                >
                                                    Aplicar
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setIsAddingNew(false);
                                                        setSelMake('');
                                                        setSelModel('');
                                                        setSelYear('');
                                                    }}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-11 px-3 text-xs text-gray-400 hover:text-white hover:bg-white/5"
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        availableMakes.length > 0 && (
                            <div className="p-4 md:p-5 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Car className="text-gray-400" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tu vehículo</p>
                                        <p className="text-white/90 text-sm leading-tight">Ingresá tu auto para ver compatibilidad</p>
                                    </div>
                                </div>
                                {/* Selects con mismo look&feel que el selector del home (CustomSelect compact) */}
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2">
                                    <CustomSelect
                                        size="compact"
                                        value={selMake}
                                        onChange={(val) => { setSelMake(val); setSelModel(''); setSelYear(''); }}
                                        options={availableMakes}
                                        placeholder="Marca"
                                    />
                                    <CustomSelect
                                        size="compact"
                                        value={selModel}
                                        onChange={(val) => { setSelModel(val); setSelYear(''); }}
                                        options={availableModels}
                                        placeholder="Modelo"
                                        disabled={!selMake}
                                        emptyText="Elegí una marca primero"
                                    />
                                    <CustomSelect
                                        size="compact"
                                        value={selYear}
                                        onChange={(val) => setSelYear(val)}
                                        options={availableYears}
                                        placeholder="Año"
                                        disabled={!selModel}
                                        emptyText="Elegí un modelo primero"
                                    />
                                    <Button
                                        onClick={handleApplyVehicle}
                                        disabled={!canApplyVehicle}
                                        size="sm"
                                        className="h-11 px-5 bg-monza-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                    >
                                        Aplicar
                                    </Button>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="w-full lg:w-64 flex-shrink-0">
                        {/* Mobile Filter Toggle Button */}
                        <div className="lg:hidden mb-2">
                            <Button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                variant="outline"
                                className="w-full justify-center h-14 bg-white/5 border-white/10 hover:bg-white/10 text-sm font-bold uppercase tracking-widest"
                            >
                                <SlidersHorizontal size={18} className="mr-3" /> Filtrar Catálogo
                            </Button>
                        </div>

                        {/* Mobile Drawer */}
                        <AnimatePresence>
                            {isMobileFiltersOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                                    />
                                    <motion.div
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                        className="lg:hidden fixed inset-x-0 bottom-0 max-h-[85vh] flex flex-col bg-carbon-950 rounded-t-3xl z-[110] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                                    >
                                        <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
                                            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Filtros</h2>
                                            <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-white/5 hover:bg-monza-red rounded-full transition-colors text-white">
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="overflow-y-auto p-6 pb-24">
                                            {renderFilters()}
                                        </div>

                                        <div className="fixed bottom-0 left-0 w-full p-4 bg-carbon-950/95 backdrop-blur-md border-t border-white/10 shrink-0">
                                            <Button onClick={() => setIsMobileFiltersOpen(false)} className="w-full h-14 bg-monza-red text-white hover:bg-white hover:text-black text-lg font-bold uppercase tracking-wider">
                                                Ver {filteredProducts.length} Resultados
                                            </Button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Desktop Sidebar */}
                        <div className="hidden lg:block">
                            {renderFilters()}
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-6">
                            {/* Buscador: arriba en mobile, derecha en desktop */}
                            <div className="relative w-full md:w-80 md:order-2">
                                <Search
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar producto..."
                                    aria-label="Buscar producto por nombre"
                                    className="w-full h-11 pl-10 pr-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                                        aria-label="Limpiar búsqueda"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <p className="text-gray-400 text-sm md:order-1">
                                Mostrando <span className="text-white font-bold">{filteredProducts.length}</span> productos
                                {searchQuery.trim() && (
                                    <span className="text-gray-500"> para “<span className="text-white/80">{searchQuery.trim()}</span>”</span>
                                )}
                            </p>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                                {filteredProducts.map((product, i) => (
                                    <FadeIn key={product.id} delay={Math.min(i * 0.04, 0.25)} y={8} amount={0.05}>
                                        <ProductCard product={product} />
                                    </FadeIn>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border border-white/5 rounded-2xl bg-white/5">
                                <p className="text-xl text-white font-bold mb-2">
                                    {searchQuery.trim() ? 'Sin resultados para tu búsqueda' : 'No se encontraron resultados'}
                                </p>
                                <p className="text-gray-400 text-sm mb-6">
                                    {searchQuery.trim()
                                        ? <>No hay productos que coincidan con “<span className="text-white/80">{searchQuery.trim()}</span>”. Probá con otra palabra o quitá los filtros.</>
                                        : 'Prueba combinando otros filtros o quitando las restricciones.'}
                                </p>
                                <Button
                                    onClick={() => { clearAllFilters(); setSearchQuery(''); }}
                                    variant="outline"
                                >
                                    Limpiar todos los filtros
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
