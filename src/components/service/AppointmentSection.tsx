import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useVehicle } from '@/context/VehicleContext';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';
import { Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

// Generate next 5 weekdays
const getAvailableDates = () => {
    const dates = [];
    let current = new Date();
    while (dates.length < 5) {
        current.setDate(current.getDate() + 1);
        if (current.getDay() !== 0 && current.getDay() !== 6) { // Skip weekends
            dates.push(new Date(current));
        }
    }
    return dates;
};

export function AppointmentSection() {
    const { currentVehicle } = useVehicle();
    const { addToast } = useToast();
    const { items } = useCart();
    const navigate = useNavigate();

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [serviceType, setServiceType] = useState('installation');

    // Calendar State
    const [dates] = useState(getAvailableDates());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !selectedDate || !selectedSlot) {
            addToast('Por favor completa todos los campos', 'error');
            return;
        }

        if (items.length === 0) {
            addToast('Tu carrito está vacío. Debes agregar productos para solicitar instalación.', 'error');
            return;
        }

        // Redirect to Cart with Appointment params
        const params = new URLSearchParams({
            apptDate: selectedDate.toISOString(),
            apptTime: selectedSlot,
            apptService: serviceType
        });

        navigate(`/cart?${params.toString()}`);
        addToast('Turno pre-aprobado. Finaliza tu compra para confirmar.', 'success');
    };

    return (
        <section className="py-32 bg-transparent px-6 border-t border-white/5 relative overflow-hidden">
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

                    {/* Booking Form */}
                    <div className="bg-carbon-900 border border-white/10 rounded-3xl p-8 relative shadow-2xl shadow-black/50">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Personal Details */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">1. Tus Datos</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Nombre Completo</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-carbon-800 border-none rounded-lg h-12 px-4 text-white focus:ring-2 focus:ring-monza-red transition-all"
                                            placeholder="Juan Pérez"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold">Teléfono</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-carbon-800 border-none rounded-lg h-12 px-4 text-white focus:ring-2 focus:ring-monza-red transition-all"
                                            placeholder="+54 9 11..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Service Details */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">2. Servicio y Vehículo</h3>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Vehículo</label>
                                    <div className="bg-carbon-800 rounded-lg p-4 flex items-center justify-between">
                                        {currentVehicle ? (
                                            <span className="text-white font-medium">
                                                {currentVehicle.year} {currentVehicle.make} {currentVehicle.model} {currentVehicle.engine}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 italic">No hay vehículo seleccionado</span>
                                        )}
                                    </div>
                                    {!currentVehicle && <p className="text-xs text-monza-red">Por favor selecciona un vehículo arriba.</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase font-bold">Tipo de Servicio</label>
                                    <select
                                        value={serviceType}
                                        onChange={(e) => setServiceType(e.target.value)}
                                        className="w-full bg-carbon-800 border-none rounded-lg h-12 px-4 text-white focus:ring-2 focus:ring-monza-red transition-all appearance-none"
                                    >
                                        <option value="installation">Instalación de Partes</option>
                                        <option value="tuning">Tuning / Reprogramación</option>
                                        <option value="maintenance">Mantenimiento General</option>
                                    </select>
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className="space-y-4">
                                <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">3. Fecha y Hora</h3>

                                {/* Date Selection */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                                    {dates.map((date, i) => {
                                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                                                className={clsx(
                                                    "min-w-[80px] p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1",
                                                    isSelected
                                                        ? "bg-monza-red border-monza-red text-white"
                                                        : "bg-carbon-800 border-transparent text-gray-400 hover:border-white/20"
                                                )}
                                            >
                                                <span className="text-xs font-bold uppercase">{DAYS[date.getDay() - 1]}</span>
                                                <span className="text-xl font-bold">{date.getDate()}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Slot Selection */}
                                <AnimatePresence>
                                    {selectedDate && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            className="grid grid-cols-3 gap-2"
                                        >
                                            {SLOTS.map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={clsx(
                                                        "py-2 rounded-lg text-sm font-bold transition-all border",
                                                        selectedSlot === slot
                                                            ? "bg-white text-carbon-950 border-white"
                                                            : "bg-carbon-800 text-gray-400 border-transparent hover:text-white"
                                                    )}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-monza-red hover:bg-red-600 text-white font-bold tracking-widest h-14"
                                disabled={!name || !selectedDate || !selectedSlot}
                            >
                                CONTINUAR Y PAGAR
                            </Button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
