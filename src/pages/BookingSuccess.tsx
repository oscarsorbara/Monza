import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, LogIn, UserPlus, Calendar, Clock, MapPin } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Cal, { getCalApi } from "@calcom/embed-react";
import { useAuth } from '@/context/AuthContext';
import { useAppointment } from '@/context/AppointmentContext';
import { useVehicle } from '@/context/VehicleContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentDetails {
    date: Date;
    time: string;
}

export default function BookingSuccess() {
    const { user } = useAuth();
    const { createAppointment, claimAppointments } = useAppointment();
    const { currentVehicle } = useVehicle();
    const [bookingCompleted, setBookingCompleted] = useState(false);
    const [apptDetails, setApptDetails] = useState<AppointmentDetails | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Option 1: Handle Redirect from AppointmentSection (URL Params)
        const confirmedParam = searchParams.get('confirmed');
        const dateParam = searchParams.get('date');

        if (confirmedParam === 'true') {
            setBookingCompleted(true);
            if (dateParam) {
                const dateObj = new Date(dateParam);
                setApptDetails({
                    date: dateObj,
                    time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }
        }

        if (user) {
            claimAppointments(user.id);
        }

        (async function () {
            const cal = await getCalApi();

            // Option 2: Fallback listener if event happens ON this page
            cal("on", {
                action: "bookingSuccessful",
                callback: (e: any) => {
                    const dateStr = e.detail?.data?.date || new Date().toISOString();
                    const dateObj = new Date(dateStr);

                    setApptDetails({
                        date: dateObj,
                        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });

                    setBookingCompleted(true);

                    createAppointment({
                        userId: user?.id,
                        sessionId: localStorage.getItem('monza_session_id') || 'unknown',
                        date: dateStr,
                        time: dateObj.toLocaleTimeString(),
                        serviceType: 'installation',
                        orderId: 'NEW-ORDER',
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
                layout: "month_view"
            });
        })();
    }, [user, currentVehicle, searchParams]);

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

                <AnimatePresence mode="wait">
                    {!bookingCompleted ? (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                    ¡Gracias por tu compra!
                                </h1>
                            </div>

                            <p className="text-gray-400 text-lg mb-12 text-center max-w-lg">
                                Agendá tu turno de instalación ahora.
                            </p>

                            <div className="w-full max-w-[1400px] px-4 md:px-8 mb-12">
                                <div className="w-full bg-carbon-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[600px]">
                                    <Cal
                                        calLink="oscar-sorbara-xbmqr9"
                                        style={{ width: "100%", height: "100%", overflow: "scroll" }}
                                        config={{ layout: 'month_view', theme: 'dark' }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-2xl flex flex-col items-center text-center"
                        >
                            {/* GREEN CHECKMARK */}
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30 ring-4 ring-green-500/20 animate-pulse-slow">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-6 uppercase">
                                ¡Turno Reservado!
                            </h2>

                            {/* APPOINTMENT DETAILS CARD */}
                            {apptDetails && (
                                <div className="w-full bg-carbon-900/50 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 justify-center items-center backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-monza-red/10 rounded-lg text-monza-red">
                                            <Calendar size={24} />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-xs uppercase text-gray-500 font-bold tracking-wider">Fecha</span>
                                            <span className="text-white font-bold text-lg">{apptDetails.date.toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="hidden md:block w-px h-12 bg-white/10" />

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-monza-red/10 rounded-lg text-monza-red">
                                            <Clock size={24} />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-xs uppercase text-gray-500 font-bold tracking-wider">Hora</span>
                                            <span className="text-white font-bold text-lg">{apptDetails.time}</span>
                                        </div>
                                    </div>

                                    <div className="hidden md:block w-px h-12 bg-white/10" />

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-monza-red/10 rounded-lg text-monza-red">
                                            <MapPin size={24} />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-xs uppercase text-gray-500 font-bold tracking-wider">Lugar</span>
                                            <span className="text-white font-bold text-lg">Monza Center</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <p className="text-xl text-gray-300 mb-12 max-w-lg leading-relaxed">
                                Tu instalación ha sido confirmada. Te enviamos todos los detalles por email.
                            </p>

                            {/* AUTH PROMPT - Should appear if !user */}
                            {!user ? (
                                <div className="w-full bg-carbon-900 border border-white/10 rounded-3xl p-8 mb-12 transform hover:border-monza-red/30 transition-all duration-300 shadow-2xl">
                                    <h3 className="text-2xl font-bold uppercase italic text-white mb-2">No pierdas tu turno</h3>
                                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                        Creá una cuenta para guardar este turno en tu perfil, ver el historial y gestionar tus pedidos.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link to="/register" className="flex-1">
                                            <Button className="w-full h-14 text-lg bg-monza-red hover:bg-red-600 text-white uppercase font-black tracking-widest gap-2 shadow-lg shadow-monza-red/20">
                                                <UserPlus size={20} /> Crear Cuenta
                                            </Button>
                                        </Link>
                                        <Link to="/login" className="flex-1">
                                            <Button variant="outline" className="w-full h-14 text-lg border-white/20 hover:bg-white/10 text-white uppercase font-black tracking-widest gap-2">
                                                <LogIn size={20} /> Ya tengo cuenta
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-12 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl">
                                    <p className="text-green-400 font-bold">
                                        ✓ Turno guardado en tu cuenta <span className="text-white">{user.email}</span>
                                    </p>
                                    <Link to="/account?tab=appointments" className="block mt-4 text-sm text-gray-400 hover:text-white underline">
                                        Ver mis turnos →
                                    </Link>
                                </div>
                            )}

                            <Link to="/catalog">
                                <Button variant="ghost" className="text-gray-500 hover:text-white hover:bg-white/5 uppercase tracking-widest font-bold">
                                    Volver al catálogo
                                </Button>
                            </Link>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
