import { Clock, CheckCircle } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProcessAnimation } from './ProcessAnimation';

interface AppointmentSectionProps {
    unlocked?: boolean;
}

export function AppointmentSection({ unlocked = false }: AppointmentSectionProps) {
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

    const isConfirmed = isPurchaseConfirmed || unlocked;

    return (
        <section className="py-20 md:py-32 bg-transparent px-4 md:px-6 border-t border-white/5 relative overflow-hidden">
            {/* Background Decoration */}
            {/* Background Decoration - Optimized */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-monza-red/5 to-transparent rounded-full pointer-events-none opacity-50" />

            <div className="container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16 items-stretch">

                    {/* Header & Visuals (LEFT) */}
                    <div className="flex flex-col h-full">
                        <div className="inline-flex items-center gap-2 text-monza-red font-bold uppercase tracking-widest text-sm mb-4">
                            <Clock className="w-4 h-4" />
                            <span>INSTALACIÓN SEGURA</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-6">
                            AGENDA TU <br /> INSTALACIÓN
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Nosotros te lo instalamos! Confirmá tu compra y luego reservá tu turno.
                        </p>

                        {/* Premium Image Integration - Flex Grow to Fill */}
                        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex-1 min-h-[400px] group">
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
                                <div className="text-white font-bold text-xl italic">Instalación en taller propio</div>
                                <div className="text-monza-red text-sm font-bold tracking-widest uppercase">Devoto, Caba</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Process Animation or Booking (RIGHT) */}
                    <div className="h-full flex flex-col">
                        {isConfirmed ? (
                            <motion.div
                                key="confirmed"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-carbon-950/50 backdrop-blur-sm border border-monza-red/20 rounded-3xl p-4 md:p-6 relative shadow-2xl shadow-monza-red/5 h-full min-h-[600px] overflow-hidden flex flex-col"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-monza-red" />
                                <div className="p-4 flex items-center gap-3 bg-monza-red/5 border-b border-white/5 mb-4 rounded-t-xl shrink-0">
                                    <CheckCircle size={18} className="text-monza-red" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-monza-red">
                                        {unlocked ? 'Pago Confirmado - Turno Habilitado' : 'Acceso Garantizado - Post Compra'}
                                    </span>
                                </div>
                                <div className="flex-1 rounded-2xl overflow-hidden">
                                    <Cal
                                        calLink="oscar-sorbara-xbmqr9"
                                        style={{ width: "100%", height: "100%", overflow: "hidden" }}
                                        config={{ layout: 'month_view', theme: 'dark' }}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            // DEFAULT VIEW: PROCESS ANIMATION
                            <div className="h-full min-h-[600px]">
                                <ProcessAnimation />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
