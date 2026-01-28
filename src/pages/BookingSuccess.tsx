
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cal, { getCalApi } from "@calcom/embed-react";
import { useAuth } from '@/context/AuthContext';
import { useAppointment } from '@/context/AppointmentContext';
import { useVehicle } from '@/context/VehicleContext';

export default function BookingSuccess() {
    const { user } = useAuth();
    const { createAppointment, claimAppointments } = useAppointment();
    const { currentVehicle } = useVehicle();

    useEffect(() => {
        // If user logs in/registers and lands here (or is already logged in), claim any pending appointments
        if (user) {
            claimAppointments(user.id);
        }

        (async function () {
            const cal = await getCalApi();

            // Listen for successful bookings
            cal("on", {
                action: "bookingSuccessful",
                callback: (e: any) => {
                    const date = e.detail?.data?.date || new Date().toISOString();
                    // Create appointment in our system
                    createAppointment({
                        userId: user?.id,
                        sessionId: localStorage.getItem('monza_session_id') || 'unknown',
                        date: date,
                        time: new Date(date).toLocaleTimeString(),
                        serviceType: 'installation',
                        orderId: 'NEW-ORDER', // Ideally we'd get this from the recent purchase context
                        vehicleInfo: {
                            make: currentVehicle?.make || 'Vehículo',
                            model: currentVehicle?.model || 'Desconocido',
                            year: currentVehicle?.year || 2024
                        }
                    });
                }
            });

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
    }, [user, currentVehicle]);

    return (
    return (
        <div className="min-h-screen bg-carbon-950 flex flex-col items-center relative overflow-hidden">
            {/* Background Gradient */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 80%), 
                        radial-gradient(circle at 50% 100%, rgba(220, 38, 38, 0.1) 0%, transparent 60%)
                    `
                }}
            />

            {/* Top Logo Bar */}
            <div className="w-full py-6 px-6 flex justify-center sticky top-0 bg-carbon-950/80 backdrop-blur-md z-50">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <img src="/monza-logo.png" alt="Monza" className="h-6 md:h-8 w-auto" />
                </Link>
            </div>

            <div className="flex-1 w-full max-w-7xl pt-12 pb-20 flex flex-col items-center px-4 relative z-10">

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
                <p className="text-gray-400 text-lg mb-12 animate-fade-in-up delay-100 text-center max-w-lg">
                    Agendá tu turno de instalación. {user ? "Quedará guardado en 'Mis Turnos'" : "Creá una cuenta para guardarlo en tu perfil."}
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

                {/* 4. Auth & Navigation Actions */}
                <div className="animate-fade-in-up delay-300 flex flex-col items-center gap-6">

                    {!user && (
                        <div className="bg-carbon-900/80 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 max-w-2xl text-center md:text-left">
                            <div>
                                <h3 className="text-white font-bold uppercase italic text-lg mb-1">Guardá tu turno</h3>
                                <p className="text-gray-400 text-sm">Creá tu cuenta ahora para ver este turno en la sección "Mis Turnos" y gestionar tus pedidos.</p>
                            </div>
                            <div className="flex gap-3">
                                <Link to="/register">
                                    <Button className="bg-monza-red text-white uppercase font-bold tracking-widest">Crear Cuenta</Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white uppercase font-bold tracking-widest">Ingresar</Button>
                                </Link>
                            </div>
                        </div>
                    )}

                    <Link to="/catalog">
                        <Button variant="outline" className="px-8 border-white/20 hover:bg-white/5">
                            Volver al catálogo
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
