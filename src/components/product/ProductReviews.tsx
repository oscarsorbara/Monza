import { useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { motion, animate } from 'framer-motion';
import { PRODUCT_REVIEWS, FALLBACK_REVIEWS } from '@/data/reviewsMock';

interface ProductReviewsProps {
    productHandle: string;
}

export function ProductReviews({ productHandle }: ProductReviewsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const reviews = PRODUCT_REVIEWS[productHandle] ?? FALLBACK_REVIEWS;

    // Smooth lateral scroll using framer-motion's animate() for sub-pixel precision
    // and a quart ease-out that decelerates slowly at the end (premium feel).
    const scroll = useCallback((direction: 'left' | 'right') => {
        const container = scrollRef.current;
        if (!container) return;

        // Align to card stride (card width + gap) so each click lands cleanly.
        const firstCard = container.querySelector('article') as HTMLElement | null;
        const computedGap = getComputedStyle(container).columnGap;
        const gap = parseFloat(computedGap) || 16;
        const stride = (firstCard?.offsetWidth ?? 320) + gap;

        const start = container.scrollLeft;
        const max = container.scrollWidth - container.clientWidth;
        const target = Math.max(0, Math.min(max, start + (direction === 'left' ? -stride : stride)));
        if (Math.abs(target - start) < 1) return;

        animate(start, target, {
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1], // ease-out-quart (smoother tail than cubic)
            onUpdate: (v) => { container.scrollLeft = v; }
        });
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
                data-lenis-prevent
                className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-proximity -mx-4 px-4 md:mx-0 md:px-0 pb-3"
                style={{ WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem' }}
            >
                {reviews.map((review, i) => (
                    <motion.article
                        key={i}
                        initial={{ opacity: 0, y: 18, scale: 0.97 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.05 }}
                        transition={{
                            // Spring physics feels more organic than timing-based easing
                            opacity: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(i * 0.1, 0.5) },
                            y: { type: 'spring', stiffness: 85, damping: 20, mass: 0.9, delay: Math.min(i * 0.1, 0.5) },
                            scale: { type: 'spring', stiffness: 85, damping: 20, mass: 0.9, delay: Math.min(i * 0.1, 0.5) }
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
