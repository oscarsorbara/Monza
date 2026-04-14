import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Sparkles } from 'lucide-react';
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

    const { suggestions, title } = useMemo(() => {
        const inCartIds = new Set(items.map(i => i.id));

        // Rule: prioritize compatibility. If uncertain → exclude.
        const eligible = products.filter(p => {
            // Always skip items already in cart
            if (inCartIds.has(p.id)) return false;

            // Must have stock
            if (p.stock <= 0) return false;

            // Must have at least one image
            if (!p.image) return false;

            if (currentVehicle) {
                const status = checkCompatibility(p, currentVehicle);
                // Only exact matches for the vehicle or explicitly universal products
                return status === 'EXACT_MATCH' || (p.isUniversal === true);
            } else {
                // No vehicle selected: only universal products
                return p.isUniversal === true;
            }
        });

        // Sort: exact matches for vehicle first, then universal. Within each group: higher rated first.
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

        const titleText = 'Otros usuarios también llevaron';

        return { suggestions: scored, title: titleText };
    }, [items, products, currentVehicle]);

    if (suggestions.length === 0) return null;

    const handleAdd = (product: Product) => {
        addToCart(product, 1, currentVehicle?.id);
    };

    return (
        <section className="mt-6 pt-5 border-t border-white/5" aria-label="Productos recomendados">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-monza-red shrink-0" />
                <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-white">
                    {title}
                </h4>
            </div>

            <div
                className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-5 md:-mx-6 px-5 md:px-6 pb-1"
                style={{ WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1.25rem' }}
            >
                {suggestions.map(p => {
                    const isUniversal = p.isUniversal === true;
                    return (
                        <article
                            key={p.id}
                            className="flex-shrink-0 w-[185px] md:w-[210px] bg-carbon-900 border border-white/5 rounded-xl overflow-hidden snap-start flex flex-col"
                        >
                            <Link
                                to={`/product/${p.handle}`}
                                onClick={closeDrawer}
                                className="relative aspect-square bg-carbon-800 overflow-hidden block group"
                            >
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Compatibility tag */}
                                <span className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isUniversal ? 'bg-white/10 text-gray-200 border border-white/10' : 'bg-green-500/15 text-green-400 border border-green-500/30'}`}>
                                    <Check className="w-2.5 h-2.5" />
                                    {isUniversal ? 'Universal' : 'Compatible'}
                                </span>
                            </Link>

                            <div className="p-3 md:p-3.5 flex flex-col flex-1">
                                <Link to={`/product/${p.handle}`} onClick={closeDrawer}>
                                    <h5 className="text-[13px] md:text-sm font-bold text-white leading-tight line-clamp-2 mb-2 min-h-[34px] md:min-h-[36px] hover:text-monza-red transition-colors">
                                        {p.name}
                                    </h5>
                                </Link>

                                <div className="mt-auto flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        {p.compareAtPrice && p.compareAtPrice > p.price && (
                                            <div className="text-[10px] md:text-[11px] text-gray-500 line-through leading-none">
                                                ${formatPrice(p.compareAtPrice)}
                                            </div>
                                        )}
                                        <div className="text-sm md:text-[15px] font-black text-white truncate">
                                            ${formatPrice(p.price)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(p)}
                                        aria-label={`Agregar ${p.name}`}
                                        className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-monza-red hover:bg-red-600 text-white flex items-center justify-center transition-colors active:scale-95"
                                    >
                                        <Plus className="w-[18px] h-[18px] md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
