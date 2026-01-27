import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function CartNotification() {
    const { lastAddedItem, showNotification, closeNotification, cartTotal, itemCount } = useCart();

    // Auto close after 5 seconds
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                closeNotification();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showNotification, closeNotification]);

    if (!lastAddedItem) return null;

    return (
        <AnimatePresence>
            {showNotification && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-24 right-4 md:right-8 z-[1000] w-full max-w-sm"
                >
                    <div className="bg-carbon-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
                        {/* Header */}
                        <div className="bg-monza-red px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                                <span className="bg-white/20 p-1 rounded-full"><Check size={12} /></span>
                                Agregado al carrito
                            </div>
                            <button onClick={closeNotification} className="text-white/80 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 bg-carbon-950/80">
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                                    <img
                                        src={lastAddedItem.image}
                                        alt={lastAddedItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold leading-tight line-clamp-2 mb-1">{lastAddedItem.name}</h4>
                                    <p className="text-gray-400 text-sm mb-2">{lastAddedItem.brand}</p>
                                    <div className="text-monza-red font-bold">${lastAddedItem.price.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Total ({itemCount} productos):</span>
                                    <span className="text-white font-bold">${cartTotal.toLocaleString()}</span>
                                </div>

                                <Link to="/cart" onClick={closeNotification}>
                                    <Button className="w-full bg-white hover:bg-gray-200 text-black font-black uppercase tracking-wider flex items-center justify-center gap-2">
                                        <ShoppingCart size={16} />
                                        Ver Carrito
                                    </Button>
                                </Link>

                                <button
                                    onClick={closeNotification}
                                    className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-widest"
                                >
                                    Seguir Comprando
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
