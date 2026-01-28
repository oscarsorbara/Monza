import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { orderManager, type Order } from '@/lib/orders';
import { PaymentMethodSelector } from '@/components/checkout/PaymentForm';
import { clsx } from 'clsx';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
    const { items, clearCart, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addToast } = useToast();

    const [currentStep, setCurrentStep] = useState<'info' | 'shipping' | 'payment'>('info');

    // Appointment Data
    const apptDate = searchParams.get('apptDate');
    const apptTime = searchParams.get('apptTime');
    const apptService = searchParams.get('apptService');
    const hasAppointment = !!apptDate;

    // Totals
    const shippingCost = cartTotal > 1000 ? 0 : 50;
    const finalTotal = cartTotal + shippingCost;

    // Form State
    const [formData, setFormData] = useState({
        email: user?.email || '',
        newsletter: true,
        firstName: user?.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        phone: '',

        // Shipping
        address: '',
        apartment: '',
        city: '',
        country: 'Argentina',
        state: '',
        zip: '',
        saveInfo: true,

        // Billing
        billingSameAsShipping: true,
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingZip: '',

        // Tax
        taxId: '',
        invoiceType: 'B',
        companyName: '',
    });

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardData, setCardData] = useState<any>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Handle checkbox
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Navigation Logic
    const nextStep = () => {
        if (currentStep === 'info') {
            if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.zip || !formData.taxId) {
                addToast('Por favor completa todos los campos obligatorios.', 'error');
                return;
            }
            if (!formData.email.includes('@')) {
                addToast('Ingresa un email válido', 'error');
                return;
            }
            setCurrentStep('shipping');
        } else if (currentStep === 'shipping') {
            // Confirm shipping method (Usually just one standard option here effectively)
            setCurrentStep('payment');
        }
    };

    const prevStep = () => {
        if (currentStep === 'payment') setCurrentStep('shipping');
        else if (currentStep === 'shipping') setCurrentStep('info');
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            addToast('Debes seleccionar un método de pago.', 'error');
            return;
        }

        // Validate Card if Stripe
        if (paymentMethod === 'stripe') {
            if (!cardData.number || cardData.number.length < 16 || !cardData.expiry || !cardData.cvc) {
                addToast('Revisa los datos de tu tarjeta.', 'error');
                return;
            }
        }

        setIsProcessing(true);

        try {
            // Fake API Latency
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Simulate slight chance of failure for demo? No, user wants reliability.
            // But we can check for a specific "fail" keyword if we wanted.

            const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

            const newOrder: Order = {
                id: orderId,
                date: new Date().toISOString(),
                status: 'processing',
                paymentStatus: 'paid',
                fulfillmentStatus: 'unfulfilled',
                items: [...items],
                total: finalTotal,
                subtotal: cartTotal,
                shippingCost,
                customer: {
                    fullName: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    taxId: formData.taxId,
                    invoiceType: formData.invoiceType,
                    companyName: formData.companyName
                },
                shippingAddress: {
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country,
                },
                billingAddress: formData.billingSameAsShipping ? {
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country,
                } : {
                    street: formData.billingAddress,
                    city: formData.billingCity,
                    state: formData.billingState,
                    zip: formData.billingZip,
                    country: formData.country,
                },
                paymentMethod,
                appointment: hasAppointment ? {
                    date: apptDate!,
                    time: apptTime!,
                    service: apptService!,
                    confirmed: true
                } : undefined
            };

            orderManager.createOrder(newOrder);
            clearCart();

            // Redirect to Success
            navigate(`/checkout/success?orderId=${orderId}`);

        } catch (err) {
            addToast('Hubo un error al procesar el pago. Intenta nuevamente.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-carbon-950 flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Tu carrito está vacío</h2>
                <Link to="/catalog">
                    <Button>Ir al Catálogo</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-carbon-950 flex flex-col lg:flex-row text-white">

            {/* Left Panel - Main Checkout Flow */}
            <div className="flex-1 p-6 lg:p-16 lg:pr-24 border-r border-white/5 order-2 lg:order-1">
                {/* Header Logo */}
                <div className="mb-12">
                    <img src="/monza-logo.png" alt="Monza" className="h-8 object-contain" />
                </div>

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-3 text-sm font-medium mb-12">
                    <span onClick={() => navigate('/cart')} className="text-monza-red cursor-pointer hover:underline">Carrito</span>
                    <ChevronRight size={14} className="text-gray-600" />
                    <span className={clsx(currentStep === 'info' ? "text-white" : "text-monza-red cursor-pointer")} onClick={() => setCurrentStep('info')}>Información</span>
                    <ChevronRight size={14} className="text-gray-600" />
                    <span className={clsx(currentStep === 'shipping' ? "text-white" : currentStep === 'payment' ? "text-monza-red cursor-pointer" : "text-gray-600")} onClick={() => currentStep === 'payment' && setCurrentStep('shipping')}>Envío</span>
                    <ChevronRight size={14} className="text-gray-600" />
                    <span className={clsx(currentStep === 'payment' ? "text-white" : "text-gray-600")}>Pago</span>
                </nav>

                {/* Dynamic Steps */}
                <div className="max-w-xl mx-auto lg:mx-0">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: INFORMATION */}
                        {currentStep === 'info' && (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Contact */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">Contacto</h2>
                                        <div className="text-sm text-gray-400">
                                            ¿Ya tienes cuenta? <span className="text-monza-red cursor-pointer hover:underline">Iniciar Sesión</span>
                                        </div>
                                    </div>
                                    <input
                                        name="email" value={formData.email} onChange={handleInputChange}
                                        type="email" placeholder="Correo Electrónico"
                                        className="w-full bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red focus:ring-1 focus:ring-monza-red transition-all"
                                    />
                                    <label className="flex items-center gap-3 select-none">
                                        <input
                                            name="newsletter" type="checkbox" checked={formData.newsletter} onChange={handleInputChange}
                                            className="w-4 h-4 rounded border-gray-600 text-monza-red focus:ring-monza-red"
                                        />
                                        <span className="text-sm text-gray-400">Enviarme novedades y ofertas exclusivas</span>
                                    </label>
                                </div>

                                {/* Shipping Address */}
                                <div className="space-y-4 pt-4">
                                    <h2 className="text-xl font-bold">Dirección de Envío</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            name="country" value={formData.country} onChange={handleInputChange}
                                            className="col-span-2 bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        >
                                            <option value="Argentina">Argentina</option>
                                            <option value="Chile">Chile</option>
                                            <option value="Uruguay">Uruguay</option>
                                        </select>
                                        <input
                                            name="firstName" value={formData.firstName} onChange={handleInputChange}
                                            placeholder="Nombre" className="bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        />
                                        <input
                                            name="lastName" value={formData.lastName} onChange={handleInputChange}
                                            placeholder="Apellidos" className="bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        />
                                        <input
                                            name="address" value={formData.address} onChange={handleInputChange}
                                            placeholder="Dirección, calle y número" className="col-span-2 bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        />
                                        <input
                                            name="apartment" value={formData.apartment} onChange={handleInputChange}
                                            placeholder="Casa, apartamento, etc. (opcional)" className="col-span-2 bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        />
                                        <input
                                            name="city" value={formData.city} onChange={handleInputChange}
                                            placeholder="Ciudad" className="bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        />
                                        <input
                                            name="zip" value={formData.zip} onChange={handleInputChange}
                                            placeholder="Código Postal" className="bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        />
                                        <input
                                            name="state" value={formData.state} onChange={handleInputChange}
                                            placeholder="Provincia" className="bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        />
                                        <input
                                            name="phone" value={formData.phone} onChange={handleInputChange}
                                            placeholder="Teléfono" className="col-span-2 bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        />
                                    </div>
                                </div>

                                {/* Tax Info */}
                                <div className="space-y-4 pt-4">
                                    <h2 className="text-xl font-bold">Datos de Facturación</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            name="invoiceType" value={formData.invoiceType} onChange={handleInputChange}
                                            className="bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        >
                                            <option value="B">Factura B (Consumidor Final)</option>
                                            <option value="A">Factura A (Responsable Inscripto)</option>
                                        </select>
                                        <input
                                            name="taxId" value={formData.taxId} onChange={handleInputChange}
                                            placeholder="DNI / CUIT" className="bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                        />
                                        {formData.invoiceType === 'A' && (
                                            <input
                                                name="companyName" value={formData.companyName} onChange={handleInputChange}
                                                placeholder="Razón Social" className="col-span-2 bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-8">
                                    <Button onClick={nextStep} size="lg" className="w-full sm:w-auto h-14 bg-monza-red text-base px-8 font-bold">
                                        Continuar a Envíos
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: SHIPPING */}
                        {currentStep === 'shipping' && (
                            <motion.div
                                key="shipping"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Review Contact/Ship */}
                                <div className="border border-white/10 rounded-xl divide-y divide-white/10 text-sm">
                                    <div className="p-4 flex gap-4">
                                        <span className="text-gray-400 w-20 shrink-0">Contacto</span>
                                        <span className="flex-1 text-white">{formData.email}</span>
                                        <span onClick={() => setCurrentStep('info')} className="text-monza-red cursor-pointer hover:underline text-xs font-bold">Cambiar</span>
                                    </div>
                                    <div className="p-4 flex gap-4">
                                        <span className="text-gray-400 w-20 shrink-0">Enviar a</span>
                                        <span className="flex-1 text-white">{formData.address}, {formData.city}, {formData.zip}</span>
                                        <span onClick={() => setCurrentStep('info')} className="text-monza-red cursor-pointer hover:underline text-xs font-bold">Cambiar</span>
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold">Método de Envío</h2>
                                <div className="border border-monza-red bg-monza-red/5 rounded-xl p-4 flex justify-between items-center cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-4 h-4 rounded-full bg-monza-red border-[3px] border-black ring-1 ring-monza-red" />
                                        <span className="font-medium text-sm">Estándar (3-5 días hábiles)</span>
                                    </div>
                                    <span className="font-bold">{shippingCost === 0 ? 'GRATIS' : `$${shippingCost}`}</span>
                                </div>

                                <div className="flex justify-between items-center pt-8">
                                    <button onClick={prevStep} className="text-monza-red hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
                                        <ArrowLeft size={16} /> Volver a Información
                                    </button>
                                    <Button onClick={nextStep} size="lg" className="bg-monza-red text-base px-8 font-bold h-14">
                                        Continuar al Pago
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: PAYMENT */}
                        {currentStep === 'payment' && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Review Table */}
                                <div className="border border-white/10 rounded-xl divide-y divide-white/10 text-sm">
                                    <div className="p-4 flex gap-4">
                                        <span className="text-gray-400 w-20 shrink-0">Contacto</span>
                                        <span className="flex-1 text-white">{formData.email}</span>
                                        <span onClick={() => setCurrentStep('info')} className="text-monza-red cursor-pointer hover:underline text-xs font-bold">Cambiar</span>
                                    </div>
                                    <div className="p-4 flex gap-4">
                                        <span className="text-gray-400 w-20 shrink-0">Enviar a</span>
                                        <span className="flex-1 text-white">{formData.address}, {formData.city}, {formData.zip}</span>
                                        <span onClick={() => setCurrentStep('info')} className="text-monza-red cursor-pointer hover:underline text-xs font-bold">Cambiar</span>
                                    </div>
                                    <div className="p-4 flex gap-4">
                                        <span className="text-gray-400 w-20 shrink-0">Método</span>
                                        <span className="flex-1 text-white">Estándar ({shippingCost === 0 ? 'Gratis' : `$${shippingCost}`})</span>
                                        <span onClick={() => setCurrentStep('shipping')} className="text-monza-red cursor-pointer hover:underline text-xs font-bold">Cambiar</span>
                                    </div>
                                </div>

                                {/* Payment Selection */}
                                <div>
                                    <h2 className="text-xl font-bold mb-2">Pago</h2>
                                    <p className="text-sm text-gray-400 mb-6">Todas las transacciones son seguras y encriptadas.</p>

                                    <PaymentMethodSelector
                                        selectedMethod={paymentMethod}
                                        onMethodSelect={setPaymentMethod}
                                        onCardDataChange={setCardData}
                                    />
                                </div>

                                {/* Billing Address Toggle */}
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Dirección de Facturación</h2>
                                    <div className="border border-white/10 rounded-xl overflow-hidden">
                                        <label className="flex items-center gap-3 p-4 bg-carbon-900 border-b border-white/10 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="billingSameAsShipping"
                                                checked={formData.billingSameAsShipping}
                                                onChange={() => setFormData(prev => ({ ...prev, billingSameAsShipping: true }))}
                                                className="w-4 h-4 text-monza-red border-gray-600 focus:ring-monza-red"
                                            />
                                            <span className="text-sm">Misma que la dirección de envío</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-4 bg-carbon-900 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="billingSameAsShipping"
                                                checked={!formData.billingSameAsShipping}
                                                onChange={() => setFormData(prev => ({ ...prev, billingSameAsShipping: false }))}
                                                className="w-4 h-4 text-monza-red border-gray-600 focus:ring-monza-red"
                                            />
                                            <span className="text-sm">Usar una dirección de facturación distinta</span>
                                        </label>

                                        {!formData.billingSameAsShipping && (
                                            <div className="p-4 bg-carbon-800 border-t border-white/10 space-y-4">
                                                <input
                                                    name="billingAddress" value={formData.billingAddress} onChange={handleInputChange}
                                                    placeholder="Dirección" className="w-full bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        name="billingCity" value={formData.billingCity} onChange={handleInputChange}
                                                        placeholder="Ciudad" className="bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                                    />
                                                    <input
                                                        name="billingZip" value={formData.billingZip} onChange={handleInputChange}
                                                        placeholder="Código Postal" className="bg-carbon-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-monza-red"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-8">
                                    <button onClick={prevStep} className="text-monza-red hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
                                        <ArrowLeft size={16} /> Volver a Envíos
                                    </button>
                                    <Button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        size="lg"
                                        className="bg-monza-red text-base px-8 font-black h-14 w-full sm:w-auto min-w-[200px]"
                                    >
                                        {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex gap-6 text-xs text-gray-400">
                    <a href="#" className="hover:text-white">Política de Reembolso</a>
                    <a href="#" className="hover:text-white">Política de Envío</a>
                    <a href="#" className="hover:text-white">Privacidad</a>
                    <a href="#" className="hover:text-white">Términos del Servicio</a>
                </div>
            </div>

            {/* Right Panel - Order Summary (Sticky on Desktop) */}
            <div className="lg:w-[450px] bg-carbon-900/50 border-l border-white/5 p-6 lg:p-12 order-1 lg:order-2">
                <div className="sticky top-12">
                    {/* Items */}
                    <div className="space-y-4 mb-8">
                        {items.map(item => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="relative w-16 h-16 bg-white/5 rounded-lg border border-white/10 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-white truncate">{item.name}</h4>
                                    <p className="text-xs text-gray-400 uppercase">{item.category}</p>
                                </div>
                                <span className="font-bold text-sm text-white">${formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-white/10 my-6" />

                    {/* Subtotals */}
                    <div className="space-y-3 text-sm text-gray-300">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-bold text-white">${formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center gap-1">Envío <span className="text-gray-500 text-xs">(Estándar)</span></span>
                            <span className="font-bold text-white">{shippingCost === 0 ? 'Gratis' : `$${formatPrice(shippingCost)}`}</span>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 my-6" />

                    {/* Total */}
                    <div className="flex justify-between items-baseline mb-8">
                        <span className="text-lg font-medium text-white">Total</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-gray-400">USD</span>
                            <span className="text-3xl font-black italic tracking-tighter text-white">
                                ${formatPrice(finalTotal)}
                            </span>
                        </div>
                    </div>

                    {hasAppointment && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-200">
                            <CheckCircle size={20} className="shrink-0 text-blue-500" />
                            <div>
                                <p className="font-bold text-blue-400 uppercase text-xs mb-1">Cita en Espera</p>
                                <p>Tu turno se confirmará automáticamente al completar el pago.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
