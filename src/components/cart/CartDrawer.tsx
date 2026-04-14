import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight, Clock, ShoppingBag, Truck, ShieldCheck, RotateCcw, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

const FREE_SHIPPING_GOAL = 1_000_000;

export function CartDrawer() {
    const {
        items,
        removeFromCart,
        updateQuantity,
        isDrawerOpen,
        closeDrawer
    } = useCart();

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const subtotalOriginal = items.reduce((sum, item) => {
        const originalPrice = item.compareAtPrice && item.compareAtPrice > item.price ? item.compareAtPrice : item.price;
        return sum + (originalPrice * item.quantity);
    }, 0);

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotalOriginal - total;

    // Free shipping progress
    const progress = Math.min((total / FREE_SHIPPING_GOAL) * 100, 100);
    const remainingForFreeShipping = Math.max(FREE_SHIPPING_GOAL - total, 0);
    const hasFreeShipping = total >= FREE_SHIPPING_GOAL && total > 0;

    // Prevent body scroll while drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
    }, [isDrawerOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isDrawerOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDrawer();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isDrawerOpen, closeDrawer]);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const shopifyItems = items.filter(i => i.variantId).map(i => ({
                variantId: i.variantId!,
                quantity: i.quantity,
                attributes: i.attributes
            }));

            if (shopifyItems.length === 0) {
                alert("Algunos productos en tu carrito son de demostración y no se pueden comprar realmente.");
                setIsCheckingOut(false);
                return;
            }

            const discountCodes = Array.from(new Set(items.map(i => i.discountCode).filter(Boolean))) as string[];

            const { createCheckout } = await import('@/lib/checkout');
            const url = await createCheckout(shopifyItems, discountCodes);

            if (!url) throw new Error("Checkout URL is undefined");

            const finalUrl = new URL(url);
            finalUrl.searchParams.append('t', Date.now().toString());
            window.location.replace(finalUrl.toString());
        } catch (error: any) {
            console.error("Checkout Error:", error);
            alert(`Error al iniciar el pago: ${error.message || error}`);
            setIsCheckingOut(false);
        }
    };

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeDrawer}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150]"
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Carrito"
                        className="fixed inset-y-0 right-0 w-full sm:w-[440px] md:w-[460px] bg-carbon-950 border-l border-white/10 z-[160] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-monza-red" />
                                <h2 className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-white">
                                    Carrito {items.length > 0 && <span className="text-gray-400 font-medium normal-case">({items.length})</span>}
                                </h2>
                            </div>
                            <button
                                onClick={closeDrawer}
                                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                                aria-label="Cerrar carrito"
                            >
                                <X size={20} />
                            </button>
                        </header>

                        {/* Empty State */}
                        {items.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                                    <ShoppingBag className="w-7 h-7 text-gray-500" />
                                </div>
                                <h3 className="text-2xl font-bold italic mb-2 text-white">Tu carrito está vacío</h3>
                                <p className="text-gray-400 mb-6 max-w-xs text-sm">Aún no agregaste partes premium a tu máquina.</p>
                                <Link to="/catalog" onClick={closeDrawer}>
                                    <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider px-8">
                                        Ir al Catálogo
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Free Shipping Progress */}
                                <div className="px-5 md:px-6 pt-4 pb-3 border-b border-white/5 shrink-0 bg-white/[0.02]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Truck className={`w-4 h-4 shrink-0 ${hasFreeShipping ? 'text-green-400' : 'text-monza-red'}`} />
                                        <p className="text-xs md:text-sm font-medium text-white">
                                            {hasFreeShipping ? (
                                                <span className="text-green-400 font-bold">¡Tenés envío gratis!</span>
                                            ) : (
                                                <>
                                                    Te faltan <span className="font-bold text-white">${formatPrice(remainingForFreeShipping)}</span> para obtener envío gratis
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${hasFreeShipping ? 'bg-green-400' : 'bg-monza-red'}`}
                                            initial={false}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                                        />
                                    </div>
                                </div>

                                {/* Scrollable items */}
                                <div className="flex-1 overflow-y-auto overscroll-contain px-5 md:px-6 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                                    <ul className="space-y-3">
                                        <AnimatePresence initial={false}>
                                            {items.map(item => (
                                                <motion.li
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 12 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.96, x: 20 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex gap-3 p-3 bg-carbon-900 border border-white/5 rounded-2xl"
                                                >
                                                    <Link
                                                        to={`/product/${item.handle}`}
                                                        onClick={closeDrawer}
                                                        className="w-20 h-20 bg-carbon-800 rounded-xl overflow-hidden shrink-0"
                                                    >
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </Link>

                                                    <div className="flex-1 min-w-0 flex flex-col">
                                                        <Link
                                                            to={`/product/${item.handle}`}
                                                            onClick={closeDrawer}
                                                            className="block"
                                                        >
                                                            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 pr-6 hover:text-monza-red transition-colors">
                                                                {item.name}
                                                            </h3>
                                                        </Link>

                                                        <div className="flex items-baseline gap-2 mt-1">
                                                            {item.compareAtPrice && item.compareAtPrice > item.price && (
                                                                <span className="text-xs text-gray-500 line-through">
                                                                    ${formatPrice(item.compareAtPrice)}
                                                                </span>
                                                            )}
                                                            <span className="text-sm font-bold text-white">${formatPrice(item.price)}</span>
                                                        </div>

                                                        <div className="mt-auto pt-2 flex items-center justify-between">
                                                            <div className="flex items-center gap-1 bg-carbon-950 rounded-full px-1.5 py-1 border border-white/10">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                    className="w-7 h-7 flex items-center justify-center hover:text-monza-red transition-colors"
                                                                    aria-label="Disminuir"
                                                                >
                                                                    <Minus size={12} />
                                                                </button>
                                                                <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="w-7 h-7 flex items-center justify-center hover:text-monza-red transition-colors"
                                                                    aria-label="Aumentar"
                                                                >
                                                                    <Plus size={12} />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                                                aria-label="Eliminar"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.li>
                                            ))}
                                        </AnimatePresence>
                                    </ul>
                                </div>

                                {/* Footer: totals + trust + CTA */}
                                <footer className="shrink-0 border-t border-white/10 bg-carbon-950 px-5 md:px-6 pt-4 pb-4 md:pb-5" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
                                    <div className="space-y-2 mb-3 text-sm">
                                        <div className="flex justify-between text-gray-300">
                                            <span>Subtotal</span>
                                            <span>${formatPrice(subtotalOriginal)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-yellow-500 font-medium">
                                                <span>Descuento</span>
                                                <span>-${formatPrice(discount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                                            <span className="text-base font-bold text-white">Total</span>
                                            <span className="text-xl font-black text-white">${formatPrice(total)}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 text-right">Envío calculado en el checkout</p>
                                    </div>

                                    {/* Trust badges */}
                                    <div className="flex items-center justify-between gap-2 mb-3 py-2 px-2 bg-white/[0.03] border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-gray-400">
                                            <ShieldCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                            <span>Garantía 30 días</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-gray-400">
                                            <RotateCcw className="w-3.5 h-3.5 text-monza-red shrink-0" />
                                            <span>Devolución fácil</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-gray-400">
                                            <Lock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                            <span>Compra segura</span>
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full h-14 min-h-[56px] text-base bg-monza-red hover:bg-red-600 border-none font-bold uppercase tracking-widest text-white rounded-xl shadow-lg shadow-monza-red/20"
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                    >
                                        {isCheckingOut ? (
                                            <>Procesando... <Clock className="ml-2 animate-spin shrink-0" size={18} /></>
                                        ) : (
                                            <>Finalizar Compra <ArrowRight className="ml-2 shrink-0" size={18} /></>
                                        )}
                                    </Button>
                                </footer>
                            </>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
