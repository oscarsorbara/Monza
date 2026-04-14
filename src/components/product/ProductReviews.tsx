import { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Review {
    name: string;
    avatar: string;
    rating: number;
    comment: string;
}

const REVIEWS: Review[] = [
    {
        name: 'Martín Rodríguez',
        avatar: 'https://i.pravatar.cc/150?img=12',
        rating: 5,
        comment: 'Excelente calidad, tal cual la descripción. La instalación fue sencilla y el producto luce impresionante. Super recomendable.'
    },
    {
        name: 'Lucía Fernández',
        avatar: 'https://i.pravatar.cc/150?img=47',
        rating: 5,
        comment: 'Llegó rápido y muy bien embalado. El acabado es premium, se nota la diferencia con opciones genéricas.'
    },
    {
        name: 'Diego Martínez',
        avatar: 'https://i.pravatar.cc/150?img=33',
        rating: 4,
        comment: 'Muy buen producto por el precio. Calidad superior a lo esperado, atención al cliente muy profesional.'
    },
    {
        name: 'Camila Pérez',
        avatar: 'https://i.pravatar.cc/150?img=44',
        rating: 5,
        comment: 'Mi auto quedó increíble. Los detalles de fabricación son impecables. Volvería a comprar sin dudar.'
    },
    {
        name: 'Federico López',
        avatar: 'https://i.pravatar.cc/150?img=15',
        rating: 5,
        comment: 'Calidad alemana a un precio justo. El equipo de Monza se tomó el tiempo para asesorarme en la compatibilidad.'
    },
    {
        name: 'Valentina Gómez',
        avatar: 'https://i.pravatar.cc/150?img=49',
        rating: 4,
        comment: 'Muy conforme con la compra. El producto cumple las expectativas y la atención fue rápida y clara.'
    }
];

export function ProductReviews() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = 320;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth'
        });
    };

    return (
        <section className="mt-12 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl md:text-3xl font-bold italic uppercase tracking-tight text-white">
                    Opiniones de clientes
                </h3>

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
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {REVIEWS.map((review, i) => (
                    <article
                        key={i}
                        className="flex-shrink-0 w-[280px] md:w-[320px] bg-carbon-900 border border-white/5 rounded-2xl p-5 shadow-lg shadow-black/20 snap-start"
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
                    </article>
                ))}
            </div>
        </section>
    );
}
