import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2, ArrowRight, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
    const { items, removeFromCart, updateQuantity } = useCart();
    const [searchParams] = useSearchParams();

    // Check for pending appointment
    const apptDate = searchParams.get('apptDate');
    const apptTime = searchParams.get('apptTime');
    const apptService = searchParams.get('apptService');
    const hasAppointment = !!apptDate;

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            // Filter only items connected to Shopify (with variantId)
            const shopifyItems = items.filter(i => i.variantId).map(i => ({
                variantId: i.variantId!,
                quantity: i.quantity
            }));

            if (shopifyItems.length === 0) {
                alert("Algunos productos en tu carrito son de demostración y no se pueden comprar realmente.");
                setIsCheckingOut(false);
                return;
            }

            // TODO: If hasAppointment, we could add attributes to the checkout here
            // e.g. customAttributes: [{key: "Appointment", value: ...}]

            const { createCheckout } = await import('@/lib/checkout');
            const url = await createCheckout(shopifyItems);
            window.location.href = url;

        } catch (error) {
            console.error("Checkout Error:", error);
            alert("Hubo un error al iniciar el pago. Intenta nuevamente.");
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
        <div className="min-h-screen bg-carbon-950 pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-5xl font-black italic tracking-tighter mb-8">CARRITO ({items.length})</h1>

                {hasAppointment && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 bg-monza-red/10 border border-monza-red/30 rounded-2xl flex items-start gap-4"
                    >
                        <div className="p-3 bg-monza-red rounded-full text-white">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Finalizar Reserva de Turno</h3>
                            <p className="text-gray-300">
                                Estás a un paso de confirmar tu <strong>{apptService === 'installation' ? 'Instalación' : 'Servicio'}</strong> para el
                                <strong className="text-white"> {new Date(apptDate!).toLocaleDateString()} a las {apptTime}</strong>.
                                Completa el pago para asegurar tu lugar.
                            </p>
                        </div>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-3 gap-12">
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
                                    className="flex gap-6 items-center p-6 bg-carbon-900 border border-white/5 rounded-2xl group"
                                >
                                    <div className="w-24 h-24 bg-carbon-800 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                                        <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                                        <div className="text-lg font-mono">${item.price.toLocaleString()}</div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-carbon-950 rounded-full px-2 py-1 border border-white/10">
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
                                        className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-carbon-900 p-8 rounded-3xl border border-white/5">
                            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider">Resumen de Orden</h3>

                            <div className="space-y-4 mb-8 text-gray-300">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span>{shipping === 0 ? 'Gratis' : `$${shipping}`}</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between text-2xl font-bold text-white">
                                    <span>Total</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-16 text-lg bg-monza-red hover:bg-red-600 border-none shadow-xl shadow-monza-red/20"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? (
                                    <>Procesando... <Clock className="ml-2 animate-spin" /></>
                                ) : (
                                    hasAppointment ? 'Confirmar Turno y Pagar' : 'Pagar Ahora'
                                )}
                                {!isCheckingOut && <ArrowRight className="ml-2" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
