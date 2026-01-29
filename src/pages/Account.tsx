import { useNavigate } from 'react-router-dom';
import { useVehicle } from '@/context/VehicleContext';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { useAppointment } from '@/context/AppointmentContext';
import { Button } from '@/components/ui/Button';
import { Car, Trash2, Plus, Package, Clock, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Account() {
    const { garage, removeVehicleFromGarage, selectVehicle, currentVehicle } = useVehicle();
    const { user, logout } = useAuth();
    const { getOrderHistory } = useOrder();
    const { getAppointmentHistory } = useAppointment();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'garage' | 'orders' | 'appointments'>('garage');

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-3xl font-black italic uppercase mb-2">Mi Cuenta</h2>
                <p className="text-gray-400 max-w-md mb-8">
                    Iniciá sesión para ver tu historial de pedidos, tus vehículos guardados y tus citas programadas.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => navigate('/login')} className="bg-monza-red px-8">
                        Iniciar Sesión
                    </Button>
                    <Button onClick={() => navigate('/catalog')} variant="outline">
                        Explorar Catálogo
                    </Button>
                </div>
            </div>
        );
    }

    const orders = getOrderHistory(user.id);
    const appointments = getAppointmentHistory(user.id);

    return (
        <div className="min-h-screen py-12 px-6 pt-[120px]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Hola, {user.user_metadata?.full_name || 'Piloto'}</h1>
                        <p className="text-gray-500 mt-2 font-medium">{user.email}</p>
                    </div>
                    <Button variant="ghost" onClick={() => { logout(); navigate('/'); }} className="text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                        <LogOut size={18} /> Cerrar Sesión
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-white/5 mb-12">
                    {[
                        { id: 'garage', label: 'Mi Garage', icon: Car },
                        { id: 'orders', label: 'Mis Pedidos', icon: Package },
                        { id: 'appointments', label: 'Mis Turnos', icon: Clock }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 pb-4 font-bold uppercase tracking-widest text-sm transition-all relative ${activeTab === tab.id ? 'text-monza-red' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-monza-red" />}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'garage' && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {garage.length === 0 ? (
                                <div className="col-span-full py-20 bg-carbon-900/50 rounded-3xl border border-dashed border-white/10 text-center">
                                    <Car className="w-16 h-16 mx-auto text-gray-700 mb-4" />
                                    <h3 className="text-xl font-bold uppercase text-white mb-2">Tu garage está vacío</h3>
                                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">Agregá un vehículo para encontrar partes compatibles garantizadas.</p>
                                    <Button onClick={() => navigate('/')} className="bg-white text-black hover:bg-gray-200">
                                        Explorar Vehículos
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {garage.map(v => (
                                        <div key={v.id} className={`p-8 rounded-3xl border transition-all ${currentVehicle?.id === v.id ? 'border-monza-red bg-monza-red/5' : 'border-white/5 bg-carbon-900'}`}>
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{v.year} {v.make}</h3>
                                                    <p className="text-gray-400 font-bold">{v.model}</p>
                                                </div>
                                                <button onClick={() => removeVehicleFromGarage(v.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            <div className="text-sm text-gray-500 mb-8 font-medium">
                                                Motor: {v.engine}
                                            </div>
                                            {currentVehicle?.id === v.id ? (
                                                <div className="w-full h-12 bg-monza-red text-white rounded-xl flex items-center justify-center font-black uppercase tracking-widest italic text-sm">
                                                    Vehículo Activo
                                                </div>
                                            ) : (
                                                <Button onClick={() => selectVehicle(v)} variant="outline" className="w-full h-12">
                                                    Seleccionar
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-white/10 hover:border-monza-red hover:bg-monza-red/5 transition-all transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-monza-red group-hover:text-white transition-all shadow-xl">
                                            <Plus size={24} />
                                        </div>
                                        <span className="font-bold uppercase tracking-widest text-sm">Agregar Vehículo</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="py-20 bg-carbon-900/50 rounded-3xl border border-dashed border-white/10 text-center">
                                    <Package className="w-16 h-16 mx-auto text-gray-700 mb-4" />
                                    <h3 className="text-xl font-bold uppercase text-white mb-2">No tienes pedidos</h3>
                                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">Realizá tu primera compra para verla reflejada aquí.</p>
                                    <Button onClick={() => navigate('/catalog')} className="bg-monza-red">
                                        Ver Catálogo
                                    </Button>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="bg-carbon-900 border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                                                <Package className="text-monza-red" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black italic uppercase tracking-tighter text-xl">{order.id}</p>
                                                <p className="text-gray-500 text-sm font-medium">{new Date(order.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-8 items-center">
                                            <div>
                                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Items</p>
                                                <p className="font-bold text-white">{order.items.reduce((acc, i) => acc + i.quantity, 0)} productos</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Total</p>
                                                <p className="font-black text-monza-red text-lg">${order.total.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${order.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {order.status === 'confirmed' ? 'Confirmado' : order.status}
                                                </span>
                                            </div>
                                            <ChevronRight className="text-gray-700 hidden md:block" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'appointments' && (
                        <div className="space-y-4">
                            {appointments.length === 0 ? (
                                <div className="py-20 bg-carbon-900/50 rounded-3xl border border-dashed border-white/10 text-center">
                                    <Clock className="w-16 h-16 mx-auto text-gray-700 mb-4" />
                                    <h3 className="text-xl font-bold uppercase text-white mb-2">No tienes citas</h3>
                                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">Seleccioná instalación al comprar tus productos.</p>
                                    <Button onClick={() => navigate('/catalog')} className="bg-monza-red">
                                        Ver Catálogo
                                    </Button>
                                </div>
                            ) : (
                                appointments.map(appt => {
                                    // Calculate if appointment is in the past
                                    // Date string format assumed ISO or compatible.
                                    // We create a Date object for the appointment day + time logic if needed, 
                                    // but checking just the day is safer for "Completed" status usually.
                                    // Let's assume end of that day.
                                    const apptDate = new Date(appt.date);
                                    const now = new Date();
                                    // Reset hours to compare pure dates for "today" vs "past" logic, 
                                    // or just strict comparison. Strict is better.
                                    const isPast = apptDate < now;

                                    // Determine Display Status
                                    let statusLabel = appt.status as string;
                                    let statusColor = "bg-gray-500/10 text-gray-500";

                                    if (isPast && appt.status !== 'cancelled') {
                                        statusLabel = "Finalizado";
                                        statusColor = "bg-gray-500/10 text-gray-400 border border-white/5";
                                    } else {
                                        switch (appt.status) {
                                            case 'requested':
                                                statusLabel = "Solicitada";
                                                statusColor = "bg-blue-500/10 text-blue-500";
                                                break;
                                            case 'confirmed':
                                                statusLabel = "Confirmada";
                                                statusColor = "bg-green-500/10 text-green-500";
                                                break;
                                            case 'cancelled':
                                                statusLabel = "Cancelada";
                                                statusColor = "bg-red-500/10 text-red-500";
                                                break;
                                            default:
                                                statusLabel = appt.status;
                                        }
                                    }

                                    return (
                                        <div key={appt.id} className={`bg-carbon-900 border p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${isPast ? 'border-white/5 opacity-60 hover:opacity-100' : 'border-white/10 hover:border-monza-red/30'}`}>
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isPast ? 'bg-white/5 grayscale' : 'bg-monza-red/10'}`}>
                                                    <Clock className={isPast ? "text-gray-500" : "text-monza-red"} />
                                                </div>
                                                <div>
                                                    <p className={`font-black italic uppercase tracking-tighter text-xl ${isPast ? 'text-gray-400' : 'text-white'}`}>
                                                        {appt.serviceType === 'installation' ? 'Instalación' : appt.serviceType}
                                                    </p>
                                                    <p className="text-gray-500 text-sm font-medium">Orden: {appt.orderId || 'Pendiente'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-8 items-center">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Fecha y Hora</p>
                                                    <p className="font-bold text-white">{new Date(appt.date).toLocaleDateString()} - {appt.time}hs</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Vehículo</p>
                                                    <p className="font-bold text-white">{appt.vehicleInfo.year} {appt.vehicleInfo.make} {appt.vehicleInfo.model}</p>
                                                </div>
                                                <div>
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${statusColor}`}>
                                                        {statusLabel}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

