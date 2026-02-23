import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Search, ShieldCheck, MessageCircle, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Definimos los pasos y duraciones
const PROCESS_STEPS = [
    {
        title: "Paso 1: Selecciona tu auto",
        subtitle: "Filtrá por modelo, año y marca",
        duration: 4000
    },
    {
        title: "Paso 2: Producto compatible",
        subtitle: "Aseguramos que el producto encaje perfecto",
        duration: 4000
    },
    {
        title: "Paso 3: Comprá de forma segura",
        subtitle: "Completá tus datos y pasarela de pago",
        duration: 4000
    },
    {
        title: "Paso 4: Escribinos por WhatsApp",
        subtitle: "Para agendar tu turno y coordinar la entrega",
        duration: 4000
    }
];

export function ProcessAnimation() {
    const [step, setStep] = useState(0);

    // Auto-rotación de los pasos
    useEffect(() => {
        const currentDuration = PROCESS_STEPS[step].duration;
        const timer = setTimeout(() => {
            setStep((prev) => (prev + 1) % PROCESS_STEPS.length);
        }, currentDuration);

        return () => clearTimeout(timer);
    }, [step]);

    return (
        <div className="w-full h-full bg-carbon-900 border border-white/10 rounded-3xl overflow-hidden relative flex flex-col shadow-2xl min-h-[500px]">
            {/* Cabecera Tipo Navegador */}
            <div className="h-10 bg-carbon-950 border-b border-white/5 flex items-center px-4 gap-2 shrink-0 z-20 relative">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 bg-carbon-800 h-6 rounded px-3 flex items-center gap-2 text-[10px] text-gray-500 font-mono ml-4 max-w-[200px]">
                    <Lock size={8} />
                    <span>monzars.com/secure</span>
                </div>
            </div>

            {/* Contenedor de la Animación Virtual (Video Fake) */}
            <div className="flex-1 relative overflow-hidden bg-carbon-950 flex flex-col justify-end">

                {/* Capa de la Animación de la UI */}
                <div className="absolute inset-0 z-0 flex items-center justify-center p-6 pb-32">
                    <AnimatePresence mode="wait">
                        {step === 0 && <Step1Animation key="step1" />}
                        {step === 1 && <Step2Animation key="step2" />}
                        {step === 2 && <Step3Animation key="step3" />}
                        {step === 3 && <Step4Animation key="step4" />}
                    </AnimatePresence>
                </div>

                {/* Gradiente Inferior para Oscurecer y leer el texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/80 to-transparent pointer-events-none z-0" />

                {/* Textos y Controles (Fijos sobre la animación) */}
                <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -15, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 pointer-events-none"
                        >
                            <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase drop-shadow-md">
                                {PROCESS_STEPS[step].title}
                            </h3>
                            <p className="text-gray-300 font-medium text-sm md:text-base mt-1 drop-shadow-md">
                                {PROCESS_STEPS[step].subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Barra de Progreso Inferior */}
                    <div className="flex gap-2 w-full z-20">
                        {PROCESS_STEPS.map((_, idx) => (
                            <div
                                key={idx}
                                className="h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                                onClick={() => setStep(idx)}
                            >
                                {step === idx && (
                                    <motion.div
                                        className="h-full bg-monza-red"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: PROCESS_STEPS[idx].duration / 1000, ease: "linear" }}
                                    />
                                )}
                                {step > idx && (
                                    <div className="h-full w-full bg-monza-red" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Animaciones Específicas Fakes ---

function Step1Animation() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm bg-carbon-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative"
        >
            <div className="flex items-center gap-3 mb-6">
                <Search className="text-monza-red" />
                <h4 className="font-bold text-lg">Buscador de Vehículo</h4>
            </div>

            <div className="space-y-4">
                <motion.div
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="h-12 w-full bg-carbon-950 border border-white/10 rounded-xl flex items-center px-4 justify-between"
                >
                    <span className="text-white font-bold">BMW</span>
                    <ChevronDown size={16} className="text-gray-500" />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                    className="h-12 w-full bg-carbon-950 border border-white/10 rounded-xl flex items-center px-4 justify-between"
                >
                    <span className="text-white font-bold">Serie 3</span>
                    <ChevronDown size={16} className="text-gray-500" />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.4 }}
                    className="h-12 w-full bg-carbon-950 border border-white/10 rounded-xl flex items-center px-4 justify-between"
                >
                    <span className="text-white font-bold">2023</span>
                    <ChevronDown size={16} className="text-gray-500" />
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.2 }}
                    className="mt-6"
                >
                    <Button className="w-full bg-monza-red hover:bg-red-600 border-none font-bold uppercase py-6">
                        Buscar Repuestos
                    </Button>
                </motion.div>
            </div>

            {/* Cursor Falso Animado */}
            <motion.div
                className="absolute z-50 pointer-events-none"
                initial={{ top: "80%", left: "80%" }}
                animate={{ top: ["80%", "70%", "85%"], left: ["80%", "50%", "50%"] }}
                transition={{ duration: 2.5, times: [0, 0.4, 1], ease: "easeInOut", delay: 1 }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /></svg>
            </motion.div>
        </motion.div>
    );
}

function Step2Animation() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm bg-carbon-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
        >
            <div className="h-32 bg-carbon-800 flex items-center justify-center border-b border-white/5 relative">
                <motion.img
                    src="/monza-logo.png"
                    alt="Product"
                    className="h-12 opacity-50"
                    initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 1 }}
                />

                {/* Insignia de Compatibilidad Dinámica */}
                <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.5, bounce: 0.6 }}
                    className="absolute -bottom-4 left-6 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border-2 border-carbon-900"
                >
                    <Check size={12} strokeWidth={4} />
                    COMPATIBLE
                </motion.div>
            </div>

            <div className="p-6 pt-8 space-y-4">
                <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                <div className="h-8 w-1/2 bg-white/20 rounded font-bold text-2xl" />

                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1, backgroundColor: ["#dc2626", "#b91c1c", "#dc2626"] }}
                    transition={{ delay: 1.5, duration: 1, repeat: Infinity }}
                    className="mt-6 w-full h-12 bg-monza-red rounded-xl flex items-center justify-center font-bold text-white uppercase tracking-wider relative overflow-hidden"
                >
                    <span className="relative z-10">Agregar al Carrito</span>
                    <motion.div
                        initial={{ x: "-100%" }} animate={{ x: "200%" }} transition={{ delay: 2, duration: 1 }}
                        className="absolute inset-0 w-1/2 bg-white/20 skew-x-12 z-0"
                    />
                </motion.div>
            </div>

            {/* Cursor Falso Animado */}
            <motion.div
                className="absolute z-50 pointer-events-none"
                initial={{ top: "100%", left: "50%" }}
                animate={{ top: ["100%", "72%", "72%"], left: ["50%", "50%", "50%"], scale: [1, 1, 0.9, 1] }}
                transition={{ duration: 2, times: [0, 0.4, 0.5, 0.6], ease: "easeInOut", delay: 1 }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /></svg>
            </motion.div>
        </motion.div>
    );
}

function Step3Animation() {
    return (
        <motion.div
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-sm"
        >
            <div className="bg-white rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-gray-900 text-lg">Shopify Secure</span>
                    <ShieldCheck className="text-green-500" />
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.5, duration: 0.5 }}
                            className="h-10 w-full border border-gray-300 rounded flex items-center px-3"
                        >
                            <span className="text-gray-800 font-mono text-sm">•••• •••• •••• 4242</span>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="h-3 w-16 bg-gray-200 rounded" />
                            <motion.div
                                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1, duration: 0.3 }}
                                className="h-10 border border-gray-300 rounded flex items-center px-3"
                            >
                                <span className="text-gray-800 text-sm">12/26</span>
                            </motion.div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-12 bg-gray-200 rounded" />
                            <motion.div
                                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.3, duration: 0.3 }}
                                className="h-10 border border-gray-300 rounded flex items-center px-3"
                            >
                                <span className="text-gray-800 text-sm">•••</span>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
                        className="mt-6"
                    >
                        <div className="w-full bg-blue-600 rounded flex justify-center py-3 text-white font-bold items-center gap-2">
                            Pagar <Lock size={16} />
                        </div>
                    </motion.div>

                    {/* Fake Loading Overlay inside Checkout */}
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                            className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
                            />
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Procesando...</span>
                        </motion.div>
                    </AnimatePresence>

                    {/* Success Overlay */}
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.5, type: "spring" }}
                            className="absolute inset-0 bg-green-500 flex flex-col items-center justify-center z-20 text-white"
                        >
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.8, type: "spring", bounce: 0.7 }}>
                                <Check size={64} strokeWidth={3} />
                            </motion.div>
                            <h2 className="text-2xl font-bold mt-2">¡Pago Exitoso!</h2>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

function Step4Animation() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm relative"
        >
            <div className="flex justify-end p-4 drop-shadow-2xl">
                {/* Botón Flotante Falso Animado */}
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.5 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center relative overflow-visible cursor-pointer"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 bg-green-500 rounded-full -z-10"
                    />
                    <MessageCircle size={32} className="text-white fill-current" />
                </motion.div>
            </div>

            {/* Globitos de Chat que emergen */}
            <div className="absolute top-0 right-20 w-64 space-y-3">
                <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: 1.5, type: "spring" }}
                    className="bg-[#25D366] text-white p-3 rounded-2xl rounded-br-sm shadow-lg text-sm"
                >
                    ¡Hola Monza! Acabo de hacer la compra de un kit de admisión térmica.
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: 2.5, type: "spring" }}
                    className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-lg text-sm self-start"
                >
                    ¡Hola! Excelente compra 🔥 ¿Para cuándo te gustaría agendar el turno de instalación?
                </motion.div>
            </div>

            {/* Cursor Falso Animado */}
            <motion.div
                className="absolute z-50 pointer-events-none"
                initial={{ top: "150%", left: "50%" }}
                animate={{ top: ["150%", "25%", "25%"], left: ["50%", "85%", "85%"], scale: [1, 1, 0.9, 1] }}
                transition={{ duration: 1.5, times: [0, 0.8, 0.9, 1], ease: "easeInOut", delay: 0.5 }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /></svg>
            </motion.div>
        </motion.div>
    );
}
