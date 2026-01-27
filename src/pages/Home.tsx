import { useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProduct } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { VehicleSelector } from '@/components/vehicle/VehicleSelector';
import { AppointmentSection } from '@/components/service/AppointmentSection';
import heroBg from '@/assets/hero-audi.jpg';

// ... (imports remain same, added WavyBackground)

// Note: COLLECTIONS are now fetched dynamically from Shopify via ProductContext.

function HeroSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative flex-1 flex flex-col items-center justify-center overflow-hidden min-h-[85vh]">
            {/* Background Video/Image Parallax */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <motion.img
                    style={{
                        y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]),
                        scale: 1.1,
                        willChange: "transform"
                    }}
                    src={heroBg}
                    alt="Audi RS6 Showcase"
                    className="w-full h-full object-cover shadow-2xl"
                />
            </div>

            {/* Visual Centering Container */}
            <motion.div
                style={{ y: yText, opacity, willChange: "transform, opacity" }}
                className="relative z-20 text-center max-w-5xl px-4 flex flex-col items-center"
            >
                {/* Upper Balance - Span */}
                <div className="mb-6">
                    <motion.div className="overflow-hidden">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-block text-sm md:text-base font-bold tracking-[0.2em] uppercase text-monza-red"
                        >
                            Est. 2024 — Performance Parts
                        </motion.span>
                    </motion.div>
                </div>

                {/* Center Focal Point - Logo */}
                <div className="relative py-12">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        src="/monza-logo.png"
                        alt="MONZA Racing Parts"
                        className="w-full max-w-lg mx-auto object-contain"
                    />
                </div>

                {/* Lower Balance - Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-4"
                >
                    <Link to="/catalog">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                            Ver Catálogo
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-bold uppercase tracking-widest animate-pulse"
            >
                Scrolleá para explorar
            </motion.div>
        </section>
    );
}

function CategoryReel() {
    const { collections } = useProduct();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Filter out collections without images if needed, or use placeholders
    const displayCollections = collections.length > 0
        ? collections
        : [];

    const ITEM_WIDTH = 312; // 280px w + 32px gap

    // Logic for Robust Infinite Scroll
    const totalItems = displayCollections.length;
    const loopSets = 3; // Significantly reduced to improve scroll performance
    const centerSetIndex = 3; // The 4th set is the center (0-indexed)
    const setWidth = totalItems * ITEM_WIDTH;
    const centerOffset = setWidth * centerSetIndex;

    // Create the massive array of items repeated
    const extendedCategories = useMemo(() => {
        return new Array(loopSets).fill(displayCollections).flat();
    }, [displayCollections]);

    // Use a ref to prevent loop logic fighting with programmatic scrolls
    const isResettingRef = useRef(false);

    // Initial positioning at the center
    useEffect(() => {
        if (scrollContainerRef.current && setWidth > 0) {
            scrollContainerRef.current.scrollLeft = centerOffset;
        }
    }, [setWidth, centerOffset, collections.length]);

    const handleScroll = () => {
        if (!scrollContainerRef.current || setWidth === 0 || isResettingRef.current) return;

        const currentScroll = scrollContainerRef.current.scrollLeft;
        const distanceFromCenter = currentScroll - centerOffset;

        // If user has scrolled more than 1 full set away from center...
        if (Math.abs(distanceFromCenter) >= setWidth) {
            isResettingRef.current = true;

            // "Teleport" back to center maintaining the exact visual phase
            // (distance % setWidth) gives us the offset within the current set pattern
            const relativeOffset = distanceFromCenter % setWidth;

            scrollContainerRef.current.style.scrollBehavior = 'auto'; // Instant jump
            scrollContainerRef.current.scrollLeft = centerOffset + relativeOffset;

            // Restore smooth scrolling in next frame
            requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.style.scrollBehavior = 'smooth';
                }
                isResettingRef.current = false;
            });
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = ITEM_WIDTH;
        const current = scrollContainerRef.current.scrollLeft;

        scrollContainerRef.current.scrollTo({
            left: direction === 'left' ? current - scrollAmount : current + scrollAmount,
            behavior: 'smooth'
        });
    };

    if (collections.length === 0) return null;

    return (
        <section className="py-32 border-b border-white/5 relative z-10">
            <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
                <h2 className="text-4xl md:text-6xl font-bold italic tracking-tighter text-white">
                    COLECCIONES
                </h2>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-8 px-6 overflow-x-auto scrollbar-hide"
            >
                {extendedCategories.map((cat, i) => (
                    <Link
                        key={`${cat.id}-${i}`}
                        to={`/catalog?category=${cat.id}`}
                        className="group relative w-[280px] h-[400px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-carbon-800 transition-transform duration-700 group-hover:scale-95" />

                        {/* Image */}
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                loading="lazy"
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80'; }}
                            />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                        <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                            <h3 className="text-3xl font-bold italic text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
                            <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">{cat.description}</p>

                            <div className="mt-4 pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                <span className="text-monza-red font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                                    Explorar <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section >
    );
}

export default function Home() {
    const { products } = useProduct();
    // Ensure we use the latest products for featured section
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col">
            {/* STICKY VEHICLE SELECTOR AT TOP (Below Navbar) */}
            <VehicleSelector />

            <HeroSection />

            {/* Rest of the page */}
            <div className="relative">


                {/* Content */}
                <div className="relative z-10">
                    <CategoryReel />

                    <AppointmentSection />

                    <section className="py-32 container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                            <div>
                                <span className="text-monza-red font-bold tracking-[0.2em] text-sm uppercase mb-4 block">Seleccionado Para Vos</span>
                                <h2 className="text-4xl md:text-6xl font-bold italic tracking-tighter text-white">
                                    COMPONENTES <br /> DESTACADOS
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
                            {featuredProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
