import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useProduct } from '@/context/ProductContext';
import { useVehicle } from '@/context/VehicleContext';
import { checkCompatibility } from '@/lib/compatibility';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductPageUpsellProps {
    currentProductId: string;
}

const MAX_UPSELL = 6;

export function ProductPageUpsell({ currentProductId }: ProductPageUpsellProps) {
    const { addToCart } = useCart();
    const { products } = useProduct();
    const { currentVehicle } = useVehicle();

    // activeIndex can go to ±Infinity — we use modulo to wrap, so it feels infinite
    // without a visible "reset" seam.
    const [activeIndex, setActiveIndex] = useState(0);

    const suggestions = useMemo(() => {
        const eligible = products.filter(p => {
            if (p.id === currentProductId) return false;
            if (p.stock <= 0) return false;
            if (!p.image) return false;

            if (currentVehicle) {
                const status = checkCompatibility(p, currentVehicle);
                return status === 'EXACT_MATCH' || p.isUniversal === true;
            }
            return p.isUniversal === true;
        });

        return eligible
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
            .slice(0, MAX_UPSELL)
            .map(s => s.product);
    }, [products, currentVehicle, currentProductId]);

    const total = suggestions.length;

    // Signed cyclical distance from activeIndex. Cards past total/2 wrap to negative.
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

    const animKey = currentVehicle?.id ?? 'no-vehicle';

    return (
        <motion.section
            key={animKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 md:mb-8"
            aria-label="Otros productos compatibles"
        >
            <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400 truncate">
                    Otros usuarios también llevaron
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={prev}
                        aria-label="Anterior"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={15} />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Siguiente"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>

            {/* 3D stage */}
            <div
                className="relative h-[300px] md:h-[330px] overflow-hidden select-none"
                style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
            >
                {suggestions.map((p, i) => {
                    const offset = offsetOf(i);
                    const absOff = Math.abs(offset);
                    const isHidden = absOff > 2;
                    const isUniversal = p.isUniversal === true;

                    // Layout tokens — tuned for both mobile and desktop. Using inline
                    // style so framer-motion can drive the transform.
                    const stride = 120; // base distance between adjacent cards in px
                    // Give side cards a bit more separation so they peek from behind center

                    return (
                        <motion.article
                            key={p.id}
                            className="absolute top-1/2 left-1/2 w-[200px] h-[280px] md:w-[220px] md:h-[300px] bg-carbon-900 border border-white/5 rounded-xl overflow-hidden flex flex-col shadow-2xl shadow-black/40"
                            style={{
                                // Center the card on the container's center point,
                                // then x-translate moves it sideways.
                                marginLeft: '-110px',
                                marginTop: '-150px',
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'hidden',
                                willChange: 'transform, opacity',
                                pointerEvents: isHidden || absOff > 1.5 ? 'none' : 'auto'
                            }}
                            animate={{
                                x: offset * stride,
                                rotateY: offset * -32,
                                scale: 1 - Math.min(absOff, 3) * 0.13,
                                opacity: isHidden ? 0 : 1 - absOff * 0.32,
                                zIndex: 10 - Math.round(absOff)
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 160,
                                damping: 26,
                                mass: 0.9
                            }}
                        >
                            <Link
                                to={`/product/${p.handle}`}
                                className="relative aspect-square bg-carbon-800 overflow-hidden block group"
                                tabIndex={absOff > 1.5 ? -1 : 0}
                            >
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    loading="lazy"
                                    draggable={false}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <span className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isUniversal ? 'bg-white/10 text-gray-200 border border-white/10' : 'bg-green-500/15 text-green-400 border border-green-500/30'}`}>
                                    <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                    {isUniversal ? 'Universal' : 'Compatible'}
                                </span>
                            </Link>

                            <div className="p-2.5 md:p-3 flex flex-col flex-1">
                                <Link to={`/product/${p.handle}`} tabIndex={absOff > 1.5 ? -1 : 0}>
                                    <h5 className="text-[12px] md:text-[13px] font-bold text-white leading-tight line-clamp-2 mb-2 min-h-[32px] md:min-h-[34px] hover:text-monza-red transition-colors">
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
                                        <div className="text-[13px] md:text-sm font-black text-white truncate">
                                            ${formatPrice(p.price)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(p)}
                                        aria-label={`Agregar ${p.name}`}
                                        tabIndex={absOff > 1.5 ? -1 : 0}
                                        className="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-full bg-monza-red hover:bg-red-600 text-white flex items-center justify-center transition-colors active:scale-95"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    );
                })}
            </div>
        </motion.section>
    );
}
