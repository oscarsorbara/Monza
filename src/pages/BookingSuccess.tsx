
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cal, { getCalApi } from "@calcom/embed-react";

export default function BookingSuccess() {
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
                layout: "month_view" // Ensures wide/horizontal layout
            });
        })();
    }, []);

    return (
        <div className="min-h-screen bg-carbon-950 pt-24 pb-20 flex flex-col items-center">

            {/* 1. Header: Gracias por tu compra */}
            <div className="flex items-center gap-3 mb-4 animate-fade-in-up">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    ¡Gracias por tu compra!
                </h1>
            </div>

            {/* 2. Section Title */}
            <p className="text-gray-400 text-lg mb-12 animate-fade-in-up delay-100">
                Agendá tu turno de instalación
            </p>

            {/* 3. Calendar (Horizontal / Wide) */}
            <div className="w-full max-w-[1400px] px-4 md:px-8 mb-12 animate-fade-in-up delay-200">
                <div className="w-full bg-carbon-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[600px]">
                    <Cal
                        calLink="oscar-sorbara-xbmqr9"
                        style={{ width: "100%", height: "100%", overflow: "scroll" }}
                        config={{ layout: 'month_view', theme: 'dark' }}
                    />
                </div>
            </div>

            {/* 4. Final Button */}
            <div className="animate-fade-in-up delay-300">
                <Link to="/catalog">
                    <Button variant="outline" className="px-8 border-white/20 hover:bg-white/5">
                        Volver al catálogo
                    </Button>
                </Link>
            </div>
        </div>
    );
}
