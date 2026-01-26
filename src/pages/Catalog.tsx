
import { useState, useMemo, useEffect } from 'react';
import { useProduct } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Filter, X, Car, ChevronDown, Check } from 'lucide-react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useVehicle } from '@/context/VehicleContext';
import { checkCompatibility } from '@/lib/compatibility';
import { cn } from '@/lib/utils';

export default function Catalog() {
    const { products, collections } = useProduct();
    const { currentVehicle } = useVehicle();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // --- Filters State ---
    const [isVehicleFilterActive, setIsVehicleFilterActive] = useState(() => {
        return location.state?.filterByVehicle ?? false;
    });

    const categoryFilter = searchParams.get('category');
    const makeFilter = searchParams.get('make');
    const collectionFilter = searchParams.get('collection');

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // --- Derived Data ---
    const categories = useMemo(() => {
        return Array.from(new Set(products.map(p => p.category))).sort();
    }, [products]);

    const carMakes = useMemo(() => {
        const makes = new Set<string>();
        products.forEach(p => {
            p.compatibility.forEach(rule => {
                if (rule.make && rule.make !== 'All') makes.add(rule.make);
            });
        });
        return Array.from(makes).sort();
    }, [products]);

    useEffect(() => {
        if (!currentVehicle) setIsVehicleFilterActive(false);
    }, [currentVehicle]);

    // --- Filtering Logic ---
    const filteredProducts = useMemo(() => {
        let result = products;

        if (currentVehicle && isVehicleFilterActive) {
            result = result.filter(p => {
                const status = checkCompatibility(p, currentVehicle);
                return status === 'EXACT_MATCH' || status === 'UNIVERSAL';
            });
        }

        if (makeFilter) {
            result = result.filter(p => {
                if (p.isUniversal) return true;
                return p.compatibility.some(rule => rule.make === 'All' || rule.make === makeFilter);
            });
        }

        if (categoryFilter) {
            result = result.filter(p => p.category === categoryFilter);
        }

        if (collectionFilter) {
            result = result.filter(p => p.collections?.includes(collectionFilter));
        }

        return result;
    }, [products, currentVehicle, isVehicleFilterActive, makeFilter, categoryFilter, collectionFilter]);

    // --- Handlers ---
    const updateFilter = (key: 'category' | 'make' | 'collection', value: string | null) => {
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

    const hasActiveFilters = categoryFilter || makeFilter || collectionFilter || isVehicleFilterActive;

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-6">
                        CATÁLOGO <span className="text-monza-red">.</span>
                    </h1>

                    {currentVehicle && (
                        <div className="flex flex-wrap items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <Car className={isVehicleFilterActive ? "text-monza-red" : "text-gray-400"} size={24} />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tu Vehículo</p>
                                    <p className="text-white font-bold text-lg leading-none">{currentVehicle.year} {currentVehicle.make} {currentVehicle.model}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
                            {!isVehicleFilterActive ? (
                                <Button
                                    onClick={() => setIsVehicleFilterActive(true)}
                                    size="sm"
                                    className="bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider"
                                >
                                    Buscar para mi auto
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
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
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div className="lg:hidden mb-6">
                            <Button
                                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                                variant="outline"
                                className="w-full justify-between"
                            >
                                <span className="flex items-center gap-2"><Filter size={16} /> Filtros</span>
                                <ChevronDown size={16} className={cn("transition-transform", isMobileFiltersOpen && "rotate-180")} />
                            </Button>
                        </div>

                        <div className={cn("lg:block space-y-8", isMobileFiltersOpen ? "block" : "hidden")}>
                            {hasActiveFilters && (
                                <div className="pb-6 border-b border-white/10">
                                    <Button
                                        onClick={clearAllFilters}
                                        variant="ghost"
                                        className="w-full justify-start text-gray-400 hover:text-monza-red px-0"
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
                                            "w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center group",
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
                                                "w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center group",
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
                                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Categorías</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => updateFilter('category', null)}
                                        className={cn(
                                            "w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center group",
                                            !categoryFilter ? "bg-white text-black font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        Todas
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => updateFilter('category', cat === categoryFilter ? null : cat)}
                                            className={cn(
                                                "w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center group",
                                                cat === categoryFilter ? "bg-white text-black font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            {cat}
                                            {cat === categoryFilter && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Marca de Auto</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => updateFilter('make', null)}
                                        className={cn(
                                            "w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center",
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
                                                "w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center",
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
                    </div>

                    <div className="flex-1">
                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                Mostrando <span className="text-white font-bold">{filteredProducts.length}</span> productos
                            </p>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border border-white/5 rounded-2xl bg-white/5">
                                <p className="text-xl text-white font-bold mb-2">No se encontraron resultados</p>
                                <p className="text-gray-400 text-sm mb-6">Prueba combinando otros filtros o quitando las restricciones.</p>
                                <Button onClick={clearAllFilters} variant="outline">
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
