import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ShoppingBag, Calendar, Printer } from 'lucide-react';
import Confetti from 'react-confetti';
import { orderManager, type Order } from '@/lib/orders';
import { BookingModal } from '@/components/service/BookingModal';
import { formatPrice } from '@/lib/utils';

export default function OrderConfirmation() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!orderId) {
            // Fallback for legitimate direct access (e.g. dev testing) or clear validation
            const last = localStorage.getItem('last_order');
            if (last) {
                setOrderData(JSON.parse(last));
            } else {
                navigate('/');
            }
            return;
        }

        const order = orderManager.getOrder(orderId);
        if (order) {
            setOrderData(order);
            // Mark purchase as confirmed for the session
            localStorage.setItem('monza_purchase_confirmed', 'true');
            // Show booking invitation after a short delay
            setTimeout(() => setIsModalOpen(true), 1500);
        } else {
            // Order not found?
            navigate('/');
        }

        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [navigate, orderId]);

    if (!orderData) return null;

    const { id, items, total, customer, appointment } = orderData;

    return (
        <div className="min-h-screen bg-carbon-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />

            <div className="absolute inset-0 bg-monza-red/5 z-0" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 max-w-2xl w-full bg-carbon-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                        <CheckCircle size={40} className="text-black" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-2">¡Orden Confirmada!</h1>
                    <p className="text-gray-400">Gracias por tu compra, <span className="text-white font-bold">{customer.fullName}</span>.</p>
                    <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Orden #{id}</p>
                </div>

                <div className="space-y-6 mb-8 border-t border-b border-white/5 py-8">
                    {appointment && (
                        <div className="bg-monza-red/10 border border-monza-red/30 p-4 rounded-xl flex items-center gap-4 mb-6">
                            <Calendar className="text-monza-red shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-white uppercase tracking-wider text-sm">Cita Confirmada</h4>
                                <p className="text-gray-300 text-sm">
                                    Te esperamos el <strong>{new Date(appointment.date).toLocaleDateString()}</strong> (Horario pendiente de confirmación final) para tu {appointment.service === 'installation' ? 'instalación' : 'servicio'}.
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Resumen de Compra</h3>
                        <div className="space-y-3">
                            {items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold font-mono">x{item.quantity}</span>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-mono text-gray-400">${formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="font-bold text-lg">Total Pagado</span>
                        <span className="font-black text-2xl text-monza-red font-mono">${formatPrice(total)}</span>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-500">Hemos enviado un email de confirmación a <span className="text-white">{customer.email}</span>.</p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/">
                            <Button variant="outline" className="w-full md:w-auto h-12">
                                <Home className="mr-2" size={18} /> Volver al Inicio
                            </Button>
                        </Link>
                        <Link to="/catalog">
                            <Button className="w-full md:w-auto h-12 bg-white text-black hover:bg-gray-200">
                                <ShoppingBag className="mr-2" size={18} /> Seguir Comprando
                            </Button>
                        </Link>
                    </div>

                    <button onClick={() => window.print()} className="text-xs font-bold text-gray-600 uppercase tracking-widest hover:text-white transition-colors mt-8 flex items-center justify-center gap-2 mx-auto">
                        <Printer size={12} /> Descargar Comprobante
                    </button>
                </div>
            </motion.div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
