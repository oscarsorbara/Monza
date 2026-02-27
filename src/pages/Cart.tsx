import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { UpsellCarousel } from '@/components/cart/UpsellCarousel';

export default function Cart() {
    const { items, removeFromCart, updateQuantity } = useCart();

    const subtotalOriginal = items.reduce((sum, item) => {
        const originalPrice = item.compareAtPrice && item.compareAtPrice > item.price ? item.compareAtPrice : item.price;
        return sum + (originalPrice * item.quantity);
    }, 0);

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotalOriginal - total;

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        console.log("Starting checkout process...");
        setIsCheckingOut(true);
        try {
            // Filter only items connected to Shopify (with variantId)
            const shopifyItems = items.filter(i => i.variantId).map(i => ({
                variantId: i.variantId!,
                quantity: i.quantity,
                attributes: i.attributes
            }));

            console.log("Shopify Items to Checkout:", shopifyItems);

            if (shopifyItems.length === 0) {
                alert("Algunos productos en tu carrito son de demostración y no se pueden comprar realmente.");
                setIsCheckingOut(false);
                return;
            }

            // Collect distinct discount codes from cart items (e.g. FLASH30)
            const discountCodes = Array.from(new Set(items.map(i => i.discountCode).filter(Boolean))) as string[];
            console.log("Discount Codes:", discountCodes);

            console.log("Importing checkout module...");
            const { createCheckout } = await import('@/lib/checkout');
            console.log("Checkout module imported. Calling createCheckout...");

            const url = await createCheckout(shopifyItems, discountCodes);
            console.log("Checkout URL returned:", url);

            if (!url) {
                throw new Error("Checkout URL is undefined");
            }

            console.log("Redirecting to:", url);

            // Force external redirection, bypassing React Router
            const finalUrl = new URL(url);
            finalUrl.searchParams.append('t', Date.now().toString()); // Cache buster

            window.location.replace(finalUrl.toString());
            return;

        } catch (error: any) {
            console.error("Checkout Error Caught:", error);
            alert(`Error al iniciar el pago: ${error.message || error}`);
            setIsCheckingOut(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-carbon-950 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl font-bold italic mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-400 mb-8 max-w-md">Parece que aún no has agregado partes premium a tu máquina.</p>
                <Link to="/catalog">
                    <Button size="lg">Volver al Catálogo</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-carbon-950 pt-28 md:pt-32 pb-32 md:pb-20 px-4 md:px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-8">
                    <h1 className="text-3xl font-black italic tracking-tighter">CARRITO ({items.length})</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 mt-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center p-4 md:p-6 bg-carbon-900 border border-white/5 rounded-2xl group relative"
                                >
                                    {/* Mobile: Top Row (Image + Details) */}
                                    <div className="flex w-full md:w-auto items-start gap-4 flex-1">
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-carbon-800 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1 pr-8 md:pr-0">
                                            <h3 className="text-lg md:text-xl font-bold mb-1 leading-tight">{item.name}</h3>
                                            <p className="text-gray-400 text-xs md:text-sm mb-1">{item.category}</p>

                                            <div className="flex items-center gap-2 md:gap-3 mt-1">
                                                {item.compareAtPrice && item.compareAtPrice > item.price && (
                                                    <span className="text-gray-500 line-through text-sm md:text-lg decoration-red-500/50">
                                                        ${formatPrice(item.compareAtPrice)}
                                                    </span>
                                                )}
                                                <div className="text-xl font-mono font-bold text-white">${formatPrice(item.price)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile: Bottom Row (Quantity + Trash) */}
                                    <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 mt-2 md:mt-0">
                                        <div className="flex items-center gap-4 bg-carbon-950 rounded-full px-2 py-1 border border-white/10 shrink-0">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-8 flex items-center justify-center hover:text-monza-red transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:text-monza-red transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-3 text-gray-500 hover:text-red-500 md:hover:bg-red-500/10 rounded-full transition-colors absolute top-2 right-2 md:relative md:top-auto md:right-auto"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>


                        {/* Upsell Carousel */}
                        <div className="pt-8">
                            <UpsellCarousel />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">

                        <div className="sticky top-32 bg-carbon-900 p-5 md:p-8 rounded-3xl border border-white/5">
                            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 uppercase tracking-wider">Resumen de Orden</h3>

                            <div className="space-y-4 mb-8 text-gray-300">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${formatPrice(subtotalOriginal)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-yellow-500 font-medium">
                                        <span>Descuento</span>
                                        <span>-${formatPrice(discount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-start">
                                    <span>Envío</span>
                                    <span className="text-right text-sm text-gray-400 max-w-[150px]">Calculado en el checkout</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between text-2xl font-bold text-white">
                                    <span>Total</span>
                                    <span>${formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="fixed bottom-0 left-0 w-full p-4 bg-carbon-950/95 backdrop-blur-md border-t border-white/10 z-[100] md:relative md:p-0 md:bg-transparent md:backdrop-blur-none md:border-t-0 md:z-auto">
                                <Button
                                    size="lg"
                                    className="w-full h-14 min-h-[56px] text-lg bg-red-600 md:bg-monza-red md:hover:bg-red-600 border-none shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-xl md:shadow-monza-red/20 font-bold uppercase tracking-widest text-white rounded-xl"
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                >
                                    {isCheckingOut ? (
                                        <>Procesando... <Clock className="ml-2 animate-spin shrink-0" /></>
                                    ) : (
                                        'Pagar Ahora'
                                    )}
                                    {!isCheckingOut && <ArrowRight className="ml-2 shrink-0" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
}
