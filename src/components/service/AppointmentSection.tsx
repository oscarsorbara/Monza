import { Clock, ShoppingBag, ArrowRight, CheckCircle, Info } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function AppointmentSection() {
    const { items, cartTotal } = useCart();
    const [isPurchaseConfirmed, setIsPurchaseConfirmed] = useState(false);

    useEffect(() => {
        // Check if purchase is confirmed in localStorage
        const confirmed = localStorage.getItem('monza_purchase_confirmed') === 'true';
        setIsPurchaseConfirmed(confirmed);

        (async function () {
            const cal = await getCalApi();
            cal("ui", {
                theme: "dark",
                styles: {
                    branding: {
                        brandColor: "#D90429",
                    },
                },
                hideEventTypeDetails: false,
                layout: "month_view"
            });
        })();
    }, []);

    const isEmpty = items.length === 0;
    const hasItems = items.length > 0 && !isPurchaseConfirmed;
    const isConfirmed = isPurchaseConfirmed;

    return (
        <section className="py-20 md:py-32 bg-transparent px-4 md:px-6 border-t border-white/5 relative overflow-hidden">
            {/* Background Decoration */}
            {/* Background Decoration - Optimized */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-monza-red/5 to-transparent rounded-full pointer-events-none opacity-50" />

            <div className="container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Header & Visuals */}
                    <div>
                        <div className="inline-flex items-center gap-2 text-monza-red font-bold uppercase tracking-widest text-sm mb-4">
                            <Clock className="w-4 h-4" />
                            <span>Service Center</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-6">
                            AGENDA TU <br /> INSTALACIÓN
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Nuestros técnicos especializados garantizan una instalación perfecta.
                            Reserva tu turno y confirma tu compra.
                        </p>

                        {/* Premium Image Integration */}
                        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[400px] group">
                            <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/90 to-transparent z-10 pointer-events-none" />

                            {/* Base Image (Lights Off) */}
                            <img
                                src="/audi-service.png"
                                alt="Audi Service Center Off"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80'; }}
                            />

                            {/* Hover Image (Lights On) - Fades in & Zooms closer */}
                            <img
                                src="/images/service-car-on.png"
                                alt="Audi Service Center On"
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 scale-[1.02] group-hover:opacity-100 group-hover:scale-[1.12]"
                            />

                            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                                <div className="text-white font-bold text-xl italic">PRECISIÓN ALEMANA</div>
                                <div className="text-monza-red text-sm font-bold tracking-widest uppercase">Taller Certificado</div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Booking State Section */}
                    <AnimatePresence mode="wait">
                        {isEmpty && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-carbon-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 text-center relative shadow-2xl overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-monza-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="w-20 h-20 bg-carbon-800 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/5 relative z-10">
                                    <ShoppingBag size={40} className="text-gray-500" />
                                </div>

                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 relative z-10 text-white">
                                    CARRITO VACÍO
                                </h3>
                                <p className="text-gray-400 mb-10 leading-relaxed max-w-sm mx-auto relative z-10">
                                    Podrás agendar tu turno de instalación luego de haber realizado la compra de los productos que desees instalar.
                                </p>

                                <Link to="/catalog" className="relative z-10">
                                    <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-10 h-14 font-black italic tracking-widest flex items-center gap-3 mx-auto">
                                        IR AL CATÁLOGO <ArrowRight size={20} />
                                    </Button>
                                </Link>
                            </motion.div>
                        )}

                        {hasItems && (
                            <motion.div
                                key="has-items"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-carbon-900 border border-white/10 rounded-3xl p-8 md:p-10 relative shadow-2xl shadow-black/50"
                            >
                                <div className="flex items-center gap-3 text-monza-red mb-6">
                                    <Info size={18} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Paso previo requerido</span>
                                </div>

                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-white">
                                    RESUMEN DEL CARRITO
                                </h3>

                                <div className="space-y-4 mb-10 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-carbon-800 rounded-lg overflow-hidden border border-white/5">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{item.name}</div>
                                                    <div className="text-gray-500 text-xs">Cantidad: {item.quantity}</div>
                                                </div>
                                            </div>
                                            <div className="font-mono text-white">${(item.price * item.quantity).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div className="flex justify-between items-center bg-carbon-950 p-4 rounded-xl border border-white/5">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Parcial</span>
                                        <span className="text-2xl font-black italic text-monza-red">${cartTotal.toLocaleString()}</span>
                                    </div>

                                    <p className="text-sm text-gray-400 italic text-center">
                                        Completa tu compra para desbloquear el calendario de instalaciones.
                                    </p>

                                    <Link to="/cart">
                                        <Button size="lg" className="w-full bg-monza-red hover:bg-red-600 text-white font-black italic tracking-widest h-16 shadow-xl shadow-monza-red/20">
                                            FINALIZAR COMPRA <ShoppingBag className="ml-2" size={20} />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {isConfirmed && (
                            <motion.div
                                key="confirmed"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-carbon-950/50 backdrop-blur-sm border border-monza-red/20 rounded-3xl p-4 md:p-6 relative shadow-2xl shadow-monza-red/5 min-h-[600px] overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-monza-red" />
                                <div className="p-4 flex items-center gap-3 bg-monza-red/5 border-b border-white/5 mb-4 rounded-t-xl">
                                    <CheckCircle size={18} className="text-monza-red" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-monza-red">Acceso Garantizado - Post Compra</span>
                                </div>
                                <Cal
                                    calLink="oscar-sorbara-xbmqr9"
                                    style={{ width: "100%", height: "100%", minHeight: "550px", overflow: "hidden" }}
                                    config={{ layout: 'month_view', theme: 'dark' }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
