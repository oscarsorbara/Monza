import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [index, setIndex] = useState(0);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const nextImage = useCallback(() => {
        setIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Preload all images on mount
    useEffect(() => {
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, [images]);

    if (images.length === 0) return null;

    return (
        <div
            className="relative w-full h-full overflow-hidden bg-carbon-900"
            // pan-y lets the browser own vertical scroll; we only intercept horizontal swipes
            style={{ touchAction: 'pan-y' }}
            onTouchStart={(e) => {
                const t = e.touches[0];
                touchStartRef.current = { x: t.clientX, y: t.clientY };
            }}
            onTouchEnd={(e) => {
                const start = touchStartRef.current;
                if (!start) return;
                const end = e.changedTouches[0];
                const dx = end.clientX - start.x;
                const dy = end.clientY - start.y;
                touchStartRef.current = null;
                // Only treat as swipe if horizontal move dominates and passes threshold
                if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
                if (dx < 0) nextImage();
                else prevImage();
            }}
        >
            {/* All images rendered, only active one visible */}
            {images.map((src, i) => (
                <img
                    key={src}
                    src={src}
                    alt={`${title} - View ${i + 1}`}
                    className={clsx(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out",
                        i === index ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                    draggable={false}
                />
            ))}

            {/* Overlay Gradient for consistency */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-carbon-950/20 via-transparent to-transparent pointer-events-none" />

            {/* Navigation Arrows — always visible, subtle */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        aria-label="Imagen anterior"
                        className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/35 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/60 hover:border-white/25 transition-colors shadow-lg shadow-black/30"
                    >
                        <ChevronLeft size={20} strokeWidth={2.2} />
                    </button>
                    <button
                        onClick={nextImage}
                        aria-label="Imagen siguiente"
                        className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/35 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/60 hover:border-white/25 transition-colors shadow-lg shadow-black/30"
                    >
                        <ChevronRight size={20} strokeWidth={2.2} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={clsx(
                                    "w-2 h-2 rounded-full transition-all",
                                    i === index ? "bg-white w-4" : "bg-white/30 hover:bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
