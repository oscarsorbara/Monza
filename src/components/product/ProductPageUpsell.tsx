import { useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { animate, motion } from 'framer-motion';
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
    const scrollRef = useRef<HTMLDivElement>(null);

    // Ultra-smooth lateral scroll with direction-aware alignment (see ProductReviews)
    const scroll = useCallback((direction: 'left' | 'right') => {
        const container = scrollRef.current;
        if (!container) return;
        const firstCard = container.querySelector('article') as HTMLElement | null;
        const gap = parseFloat(getComputedStyle(container).columnGap) || 12;
        const stride = (firstCard?.offsetWidth ?? 240) + gap;

        const start = container.scrollLeft;
        const max = container.scrollWidth - container.clientWidth;

        if (direction === 'right' && start >= max - 1) return;
        if (direction === 'left' && start <= 1) return;

        const alignedStart = direction === 'left'
            ? Math.min(max, Math.ceil(start / stride) * stride)
            : Math.max(0, Math.floor(start / stride) * stride);

        let target = alignedStart + (direction === 'right' ? stride : -stride);
        target = Math.max(0, Math.min(max, target));
        if (Math.abs(target - start) < 2) return;

        animate(start, target, {
            type: 'spring',
            stiffness: 55,
            damping: 20,
            mass: 1,
            restDelta: 0.5,
            onUpdate: (v) => { container.scrollLeft = v; }
        });
    }, []);

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
            .slice(0, MAX_UPSELL)
            .map(s => s.product);

        return scored;
    }, [products, currentVehicle, currentProductId]);

    const handleAdd = (product: Product) => {
        addToCart(product, 1, currentVehicle?.id);
    };

    // Keyed by vehicle id so the section re-mounts and re-animates when the user
    // confirms or changes their vehicle — produces a fluid "arrival" instead of a pop.
    const animKey = currentVehicle?.id ?? 'no-vehicle';

    if (suggestions.length === 0) return null;

    return (
        <motion.section
            key={animKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 md:mb-8"
            aria-label="Otros productos compatibles"
        >
            <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400 truncate">
                    Otros usuarios también llevaron
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => scroll('left')}
                        aria-label="Anterior"
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        aria-label="Siguiente"
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                data-lenis-prevent
                className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-proximity -mx-4 md:mx-0 px-4 pr-8 md:pl-0 md:pr-4 pb-1"
                style={{ WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem' }}
            >
                {suggestions.map((p, i) => {
                    const isUniversal = p.isUniversal === true;
                    return (
                        <motion.article
                            key={p.id}
                            initial={{ opacity: 0, y: 14, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1],
                                delay: 0.1 + Math.min(i * 0.07, 0.35)
                            }}
                            className="flex-shrink-0 w-[210px] md:w-[228px] bg-carbon-900 border border-white/5 rounded-xl overflow-hidden snap-start flex flex-col"
                        >
                            <Link
                                to={`/product/${p.handle}`}
                                className="relative aspect-square bg-carbon-800 overflow-hidden block group"
                            >
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isUniversal ? 'bg-white/10 text-gray-200 border border-white/10' : 'bg-green-500/15 text-green-400 border border-green-500/30'}`}>
                                    <Check className="w-3 h-3" />
                                    {isUniversal ? 'Universal' : 'Compatible'}
                                </span>
                            </Link>

                            <div className="p-3.5 flex flex-col flex-1">
                                <Link to={`/product/${p.handle}`}>
                                    <h5 className="text-[14px] font-bold text-white leading-tight line-clamp-2 mb-2.5 min-h-[36px] hover:text-monza-red transition-colors">
                                        {p.name}
                                    </h5>
                                </Link>

                                <div className="mt-auto flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        {p.compareAtPrice && p.compareAtPrice > p.price && (
                                            <div className="text-[11px] text-gray-500 line-through leading-none">
                                                ${formatPrice(p.compareAtPrice)}
                                            </div>
                                        )}
                                        <div className="text-[15px] font-black text-white truncate">
                                            ${formatPrice(p.price)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(p)}
                                        aria-label={`Agregar ${p.name}`}
                                        className="w-10 h-10 shrink-0 rounded-full bg-monza-red hover:bg-red-600 text-white flex items-center justify-center transition-colors active:scale-95"
                                    >
                                        <Plus className="w-5 h-5" />
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
