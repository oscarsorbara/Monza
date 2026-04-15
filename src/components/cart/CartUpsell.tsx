import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useProduct } from '@/context/ProductContext';
import { useVehicle } from '@/context/VehicleContext';
import { checkCompatibility } from '@/lib/compatibility';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

const MAX_UPSELL_ITEMS = 6;

export function CartUpsell() {
    const { items, addToCart, closeDrawer } = useCart();
    const { products } = useProduct();
    const { currentVehicle } = useVehicle();

    // activeIndex ±∞; offsetOf wraps cyclically (same mechanism as the 3D carousel
    // but without 3D transforms — more restrained visuals for the drawer).
    const [activeIndex, setActiveIndex] = useState(0);

    const { suggestions, title } = useMemo(() => {
        const inCartIds = new Set(items.map(i => i.id));

        const eligible = products.filter(p => {
            if (inCartIds.has(p.id)) return false;
            if (p.stock <= 0) return false;
            if (!p.image) return false;

            if (currentVehicle) {
                const status = checkCompatibility(p, currentVehicle);
                return status === 'EXACT_MATCH' || (p.isUniversal === true);
            } else {
                return p.isUniversal === true;
            }
        });

        const scored = eligible
            .map(p => {
                const isUniversal = p.isUniversal === true;
                const isExactMatch = currentVehicle
                    ? checkCompatibility(p, currentVehicle) === 'EXACT_MATCH' && !isUniversal
                    : false;
                return {
                    product: p,
                    score: (isExactMatch ? 100 : 0) + (isUniversal ? 50 : 0) + (p.rating || 0)
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_UPSELL_ITEMS)
            .map(s => s.product);

        return { suggestions: scored, title: 'Otros usuarios también llevaron' };
    }, [items, products, currentVehicle]);

    const total = suggestions.length;

    const offsetOf = useCallback((i: number) => {
        if (total === 0) return 0;
        let o = ((i - activeIndex) % total + total) % total;
        if (o > total / 2) o -= total;
        return o;
    }, [activeIndex, total]);

    const next = useCallback(() => setActiveIndex(a => a + 1), []);
    const prev = useCallback(() => setActiveIndex(a => a - 1), []);

    if (total === 0) return null;

    const handleAdd = (product: Product) => {
        addToCart(product, 1, currentVehicle?.id);
    };

    return (
        <section className="mt-6 pt-5 border-t border-white/5" aria-label="Productos recomendados">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4 h-4 text-monza-red shrink-0" />
                    <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-white truncate">
                        {title}
                    </h4>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={prev}
                        aria-label="Anterior"
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Siguiente"
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Calm carousel stage — infinite rotation, no 3D perspective, just subtle scale/opacity */}
            <div className="relative h-[280px] md:h-[300px] overflow-hidden select-none">
                {suggestions.map((p, i) => {
                    const offset = offsetOf(i);
                    const absOff = Math.abs(offset);
                    const isHidden = absOff > 2;
                    const isUniversal = p.isUniversal === true;

                    // Stride: how far apart adjacent cards sit. ~80% of card width so
                    // neighbors peek but don't overlap heavily.
                    const stride = 140;

                    return (
                        <motion.article
                            key={p.id}
                            className="absolute top-1/2 left-1/2 w-[170px] h-[260px] md:w-[185px] md:h-[280px] bg-carbon-900 border border-white/5 rounded-xl overflow-hidden flex flex-col shadow-xl shadow-black/30"
                            style={{
                                marginLeft: '-85px',
                                marginTop: '-130px',
                                willChange: 'transform, opacity',
                                pointerEvents: isHidden || absOff > 1.2 ? 'none' : 'auto'
                            }}
                            animate={{
                                x: offset * stride,
                                scale: 1 - Math.min(absOff, 3) * 0.08,
                                opacity: isHidden ? 0 : 1 - absOff * 0.28,
                                zIndex: 10 - Math.round(absOff)
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 140,
                                damping: 24,
                                mass: 1
                            }}
                        >
                            <Link
                                to={`/product/${p.handle}`}
                                onClick={closeDrawer}
                                className="relative aspect-square bg-carbon-800 overflow-hidden block group"
                                tabIndex={absOff > 1.2 ? -1 : 0}
                            >
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    loading="lazy"
                                    draggable={false}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <span className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isUniversal ? 'bg-white/10 text-gray-200 border border-white/10' : 'bg-green-500/15 text-green-400 border border-green-500/30'}`}>
                                    <Check className="w-2.5 h-2.5" />
                                    {isUniversal ? 'Universal' : 'Compatible'}
                                </span>
                            </Link>

                            <div className="p-3 flex flex-col flex-1">
                                <Link to={`/product/${p.handle}`} onClick={closeDrawer} tabIndex={absOff > 1.2 ? -1 : 0}>
                                    <h5 className="text-[13px] font-bold text-white leading-tight line-clamp-2 mb-2 min-h-[34px] hover:text-monza-red transition-colors">
                                        {p.name}
                                    </h5>
                                </Link>

                                <div className="mt-auto flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        {p.compareAtPrice && p.compareAtPrice > p.price && (
                                            <div className="text-[10px] text-gray-500 line-through leading-none">
                                                ${formatPrice(p.compareAtPrice)}
                                            </div>
                                        )}
                                        <div className="text-sm font-black text-white truncate">
                                            ${formatPrice(p.price)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(p)}
                                        aria-label={`Agregar ${p.name}`}
                                        tabIndex={absOff > 1.2 ? -1 : 0}
                                        className="w-9 h-9 shrink-0 rounded-full bg-monza-red hover:bg-red-600 text-white flex items-center justify-center transition-colors active:scale-95"
                                    >
                                        <Plus className="w-[18px] h-[18px]" />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    );
                })}
            </div>
        </section>
    );
}
