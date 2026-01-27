import { Clock } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from 'react';

export function AppointmentSection() {
    useEffect(() => {
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

                    {/* Booking Form - Replaced with Cal.com Embed */}
                    <div className="bg-carbon-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-4 md:p-6 relative shadow-2xl shadow-black/50 min-h-[600px] overflow-hidden">
                        <Cal
                            calLink="oscar-sorbara-xbmqr9"
                            style={{ width: "100%", height: "100%", minHeight: "600px", overflow: "hidden" }}
                            config={{ layout: 'month_view', theme: 'dark' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
