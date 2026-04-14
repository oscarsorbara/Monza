import { useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { PRODUCT_REVIEWS, FALLBACK_REVIEWS } from '@/data/reviewsMock';

interface ProductReviewsProps {
    productHandle: string;
}

export function ProductReviews({ productHandle }: ProductReviewsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const reviews = PRODUCT_REVIEWS[productHandle] ?? FALLBACK_REVIEWS;

    // Smooth RAF-based horizontal scroll (premium cubic ease)
    const scroll = useCallback((direction: 'left' | 'right') => {
        const container = scrollRef.current;
        if (!container) return;

        // Align to card stride (card width + gap) for a clean snap feel
        const firstCard = container.querySelector('article') as HTMLElement | null;
        const gap = parseFloat(getComputedStyle(container).columnGap || '16') || 16;
        const stride = (firstCard?.offsetWidth ?? 320) + gap;
        const delta = direction === 'left' ? -stride : stride;

        const start = container.scrollLeft;
        const max = container.scrollWidth - container.clientWidth;
        const end = Math.max(0, Math.min(max, start + delta));
        if (end === start) return;

        const duration = 520;
        const t0 = performance.now();
        const ease = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic

        const step = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            container.scrollLeft = start + (end - start) * ease(p);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, []);

    // Aggregate rating
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

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
                            {avgRating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'}
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                        aria-label="Siguiente"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-3"
                style={{ WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem' }}
            >
                {reviews.map((review, i) => (
                    <motion.article
                        key={i}
                        initial={{ opacity: 0, y: 14, scale: 0.985 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.12 }}
                        transition={{
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                            delay: Math.min(i * 0.08, 0.4)
                        }}
                        className="flex-shrink-0 w-[78vw] max-w-[300px] md:w-[320px] md:max-w-none bg-carbon-900 border border-white/5 rounded-2xl p-5 shadow-lg shadow-black/20 snap-start"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={review.avatar}
                                alt={review.name}
                                loading="lazy"
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
                        <p className="text-sm text-gray-300 leading-relaxed">{review.comment}</p>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
