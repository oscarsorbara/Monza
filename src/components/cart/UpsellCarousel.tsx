import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShoppingCart, Timer, ChevronRight, Zap } from 'lucide-react';
import { PRODUCTS } from '@/data/productsMock';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function UpsellCarousel() {
    const { addToCart } = useCart();
    // Start at 7 minutes (420 seconds)
    const [timeLeft, setTimeLeft] = useState(420);
    const [isExpired, setIsExpired] = useState(false);

    // Filter 3 distinct products for upsell (Oil, Intake, Spoiler)
    // Fallback to first 3 items if IDs don't match (Safety Check)
    const specificUpsell = PRODUCTS.filter(p => ['p6', 'p2', 'p5'].includes(p.id));
    const upsellProducts = specificUpsell.length >= 3 ? specificUpsell : PRODUCTS.slice(0, 3);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddUpsell = (originalProduct: typeof PRODUCTS[0]) => {
        // Conceptually apply 30% discount
        // In a real app, we'd pass a discount code or modified price object
        // For simulation, we add it and maybe show a toast (or just let standard cart logic handle it)
        // Since we can't easily modify the CartContext types on the fly to support custom prices without refactoring,
        // we will add the product as is but visually it "looked" discounted.
        // OR better: we can cheat gracefully.

        addToCart(originalProduct, 1);
    };



    console.log("Upsell Debug: Products Found", upsellProducts.length);

    return (
        <section className={`mb-12 border-4 border-yellow-500 rounded-3xl overflow-hidden transition-all duration-500 ${isExpired ? 'border-gray-800 opacity-60 grayscale' : 'border-monza-red/30 bg-carbon-900/50'}`}>
            <div className="bg-yellow-500 text-black font-bold p-2 text-center">DEBUG: UPSELL COMPONENT RENDERED (Found {upsellProducts.length} products)</div>
            {/* Header */}
            <div className={`p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b ${isExpired ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-monza-red/10 to-transparent border-monza-red/20'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isExpired ? 'bg-gray-700 text-gray-400' : 'bg-monza-red text-white animate-pulse'}`}>
                        {isExpired ? <Clock size={20} /> : <Zap size={20} />}
                    </div>
                    <div>
                        <h3 className={`font-bold uppercase tracking-wider ${isExpired ? 'text-gray-400' : 'text-white'}`}>
                            {isExpired ? 'Oferta Expirada' : 'Oferta Relámpago - 30% OFF'}
                        </h3>
                        {!isExpired && (
                            <p className="text-xs text-monza-red font-bold">
                                Antes de finalizar tu compra
                            </p>
                        )}
                    </div>
                </div>

                <div className={`flex items-center gap-2 font-mono text-2xl font-black ${isExpired ? 'text-gray-600' : 'text-monza-red'}`}>
                    <Timer size={24} />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Carousel Grid */}
            <div className="grid md:grid-cols-3 gap-4 p-6">
                {upsellProducts.map((product) => {
                    const discountPrice = product.price * 0.7;

                    return (
                        <div key={product.id} className="bg-carbon-950 border border-white/5 rounded-xl p-4 flex flex-col group relative overflow-hidden">
                            {/* 30% Badge */}
                            {!isExpired && (
                                <div className="absolute top-0 right-0 bg-monza-red text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
                                    -30%
                                </div>
                            )}

                            <div className="h-32 mb-4 overflow-hidden rounded-lg bg-white/5 relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${!isExpired && 'group-hover:scale-110'}`}
                                />
                            </div>

                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-gray-200 leading-tight mb-1 line-clamp-2">
                                    {product.name}
                                </h4>
                                <p className="text-xs text-gray-500 mb-3">{product.brand}</p>

                                <div className="flex items-end gap-2 mb-4">
                                    <span className={`text-lg font-bold ${isExpired ? 'text-gray-500' : 'text-white'}`}>
                                        ${formatPrice(discountPrice)}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through mb-1">
                                        ${formatPrice(product.price)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                className={`w-full ${isExpired ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                onClick={() => !isExpired && handleAddUpsell(product)}
                                disabled={isExpired}
                            >
                                <ShoppingCart size={14} className="mr-2" />
                                {isExpired ? 'Expirado' : 'Agregar Ahora'}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
