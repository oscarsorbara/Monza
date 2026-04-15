import { useState, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { PRODUCT_REVIEWS, FALLBACK_REVIEWS } from '@/data/reviewsMock';

interface ProductReviewsProps {
    productHandle: string;
}

export function ProductReviews({ productHandle }: ProductReviewsProps) {
    const reviews = PRODUCT_REVIEWS[productHandle] ?? FALLBACK_REVIEWS;
    const total = reviews.length;

    // activeIndex can go to ±∞; offsetOf() wraps it cyclically.
    const [activeIndex, setActiveIndex] = useState(0);

    const offsetOf = useCallback((i: number) => {
        if (total === 0) return 0;
        let o = ((i - activeIndex) % total + total) % total;
        if (o > total / 2) o -= total;
        return o;
    }, [activeIndex, total]);

    const next = useCallback(() => setActiveIndex(a => a + 1), []);
    const prev = useCallback(() => setActiveIndex(a => a - 1), []);

    // Aggregate rating for the header
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, total);

    if (total === 0) return null;

    return (
        <section className="mt-10 md:mt-12 mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
                <div className="min-w-0">
                    <h3 className="text-xl md:text-3xl font-bold italic uppercase tracking-tight text-white">
                        Opiniones de clientes
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                    key={idx}
                                    size={14}
                                    className={clsx(
                                        idx < Math.round(avgRating)
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-white/20'
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-xs md:text-sm text-gray-400">
                            {avgRating.toFixed(1)} · {total} {total === 1 ? 'opinión' : 'opiniones'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={prev}
                        aria-label="Anterior"
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Siguiente"
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* 3D stage */}
            <div
                className="relative h-[260px] md:h-[280px] overflow-hidden select-none"
                style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
            >
                {reviews.map((review, i) => {
                    const offset = offsetOf(i);
                    const absOff = Math.abs(offset);
                    const isHidden = absOff > 2;

                    return (
                        <motion.article
                            key={i}
                            className="absolute top-1/2 left-1/2 w-[260px] h-[220px] md:w-[300px] md:h-[240px] bg-carbon-900 border border-white/5 rounded-2xl p-5 shadow-2xl shadow-black/40"
                            style={{
                                marginLeft: '-130px',
                                marginTop: '-110px',
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'hidden',
                                willChange: 'transform, opacity',
                                pointerEvents: isHidden || absOff > 1.5 ? 'none' : 'auto'
                            }}
                            animate={{
                                x: offset * 150,
                                rotateY: offset * -30,
                                scale: 1 - Math.min(absOff, 3) * 0.12,
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
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    loading="lazy"
                                    draggable={false}
                                    className="w-11 h-11 rounded-full object-cover border border-white/10"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white text-sm truncate">{review.name}</p>
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <Star
                                                key={idx}
                                                size={13}
                                                className={clsx(
                                                    idx < review.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : 'text-white/20'
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed line-clamp-5">{review.comment}</p>
                        </motion.article>
                    );
                })}
            </div>
        </section>
    );
}
