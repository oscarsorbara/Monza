import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [index, setIndex] = useState(0);

    const nextImage = () => {
        setIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (images.length === 0) return null;

    return (
        <div className="relative w-full h-full group">
            <AnimatePresence mode="wait">
                <motion.img
                    key={index}
                    src={images[index]}
                    alt={`${title} - View ${index + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(_, { offset }) => {
                        const swipe = offset.x; // + right, - left
                        if (swipe < -100) nextImage();
                        else if (swipe > 100) prevImage();
                    }}
                />
            </AnimatePresence>

            {/* Overlay Gradient for consistency */}
            <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/20 via-transparent to-transparent pointer-events-none" />

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
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
