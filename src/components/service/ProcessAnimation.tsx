import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Lock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProcessAnimation() {
    // 0: Catalog, 1: Checkout, 2: Booking
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Dynamic duration: Step 0 (Selection) is faster (3s), others are standard (5s)
        const duration = step === 0 ? 3000 : 5000;

        const timer = setTimeout(() => {
            setStep((prev) => (prev + 1) % 3);
        }, duration);

        return () => clearTimeout(timer);
    }, [step]);

    // Cursor Animation Variants
    // Adjusted co-ordinates to match CENTERED content (max-w-[280px])
    // Assuming container is relative. 50% x is safe for centered buttons.
    const cursorVariants = {
        step0: {
            x: "50%", y: "65%", opacity: 1
        },
        step1: {
            x: "50%", y: "75%", opacity: 1
        },
        step2: {
            x: "57%", y: "55%", opacity: 1
        }
    };

    const cursorTransition = {
        duration: step === 0 ? 1.2 : 1.5,
        ease: "easeInOut"
    };

    return (
        <div className="w-full h-full bg-carbon-900 border border-white/10 rounded-3xl overflow-hidden relative flex flex-col shadow-2xl min-h-[500px]">
            {/* Browser Header Simulation */}
            <div className="h-10 bg-carbon-950 border-b border-white/5 flex items-center px-4 gap-2 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 bg-carbon-800 h-6 rounded px-3 flex items-center gap-2 text-[10px] text-gray-500 font-mono ml-4 max-w-[200px]">
                    <Lock size={8} />
                    <span>monzarp.com/secure</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden bg-black/40">
                <AnimatePresence mode="wait">
                    {step === 0 && <CatalogStep key="step0" />}
                    {step === 1 && <CheckoutStep key="step1" />}
                    {step === 2 && <BookingStep key="step2" />}
                </AnimatePresence>

                {/* Simulated Cursor - Always Visible */}
                <motion.div
                    className="absolute z-50 pointer-events-none drop-shadow-xl"
                    initial={{ x: "50%", y: "120%", opacity: 1 }} // Start from bottom
                    animate={
                        step === 0 ? cursorVariants.step0 :
                            step === 1 ? cursorVariants.step1 :
                                cursorVariants.step2
                    }
                    transition={cursorTransition}
                >
                    {/* Inner container for Scale/Click effect - Key forces re-render/animate */}
                    <motion.div
                        key={`cursor-scale-${step}`}
                        animate={{ scale: [1, 1, 0.85, 1] }}
                        transition={{
                            delay: step === 0 ? 1.2 : 1.5,
                            duration: 0.3,
                            times: [0, 0.1, 0.5, 1]
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-lg">
                            <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L17.4741 12.3673H5.65376Z" fill="black" stroke="white" strokeWidth="1.5" />
                        </svg>
                    </motion.div>

                    {/* Ripple Effect on Click */}
                    <motion.div
                        key={`cursor-ripple-${step}`}
                        className="w-10 h-10 rounded-full bg-white/20 absolute -top-3 -left-3"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 2, opacity: [0, 1, 0] }}
                        transition={{
                            delay: step === 0 ? 1.2 : 1.5,
                            duration: 0.4,
                            repeat: 0
                        }}
                    />
                </motion.div>

                {/* Step Indicators */}
                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-40">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                step === i ? "bg-monza-red w-6" : "bg-white/20"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// STEP 1: CATALOG
function CatalogStep() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full p-6 flex flex-col items-center justify-center"
        >
            <div className="text-monza-red font-bold text-xs uppercase tracking-widest mb-4">Paso 1: Selección</div>

            <div className="w-full max-w-[280px] bg-carbon-800 rounded-xl overflow-hidden border border-white/5 shadow-lg group">
                <div className="h-32 bg-carbon-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Placeholder for Product Image */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <ShoppingCart size={32} />
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-monza-red/40 rounded animate-pulse" />
                    <div className="pt-2">
                        <motion.div
                            animate={{ scale: [1, 0.95, 1] }}
                            transition={{ delay: 0.85, duration: 0.2 }}
                            className="w-full h-8 bg-monza-red text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center"
                        >
                            Agregar al Carrito
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// STEP 2: CHECKOUT
function CheckoutStep() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full p-6 flex flex-col items-center justify-center bg-white text-black"
        >
            <div className="text-monza-red font-bold text-xs uppercase tracking-widest mb-4">Paso 2: Pago Seguro</div>

            <div className="w-full max-w-[280px] space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-sm">Monza Checkout</h3>
                    <div className="flex gap-2 text-gray-400">
                        <CreditCard size={12} />
                        <Lock size={12} />
                    </div>
                </div>

                <div className="space-y-2 opacity-60">
                    <div className="h-8 w-full bg-gray-100 rounded border border-gray-200 animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-8 w-1/2 bg-gray-100 rounded border border-gray-200 animate-pulse" />
                        <div className="h-8 w-1/2 bg-gray-100 rounded border border-gray-200 animate-pulse" />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold">Total</span>
                        <span className="text-sm font-bold">$972.000</span>
                    </div>
                    <motion.div
                        animate={{ scale: [1, 0.95, 1] }}
                        transition={{ delay: 1.05, duration: 0.2 }}
                        className="w-full h-10 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center shadow-lg"
                    >
                        Pagar Ahora
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// STEP 3: BOOKING
function BookingStep() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-6"
        >
            <div className="text-green-500 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <Check size={14} /> Pago Confirmado
            </div>

            <div className="w-full max-w-[260px] bg-carbon-800 rounded-xl p-4 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-monza-red" />

                <div className="flex justify-between items-center mb-4">
                    <span className="text-white text-xs font-bold">Enero 2026</span>
                    <div className="flex gap-1 text-gray-500">
                        <div className="w-4 h-4 rounded bg-white/5" />
                        <div className="w-4 h-4 rounded bg-white/5" />
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-4">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="text-[8px] text-gray-500 text-center">D</div>
                    ))}
                    {[...Array(28)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={cn(
                                "aspect-square rounded flex items-center justify-center text-[8px]",
                                i === 15 ? "bg-monza-red text-white font-bold" : "bg-white/5 text-gray-400"
                            )}
                            animate={i === 15 ? { scale: [1, 1.2, 1], backgroundColor: ["rgba(255,255,255,0.05)", "#D90429", "#D90429"] } : {}}
                            transition={i === 15 ? { delay: 1.05, duration: 0.3 } : {}}
                        >
                            {i + 1}
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
                className="bg-green-500 text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-lg hover:shadow-green-500/20"
            >
                <Check size={12} />
                <span>Turno Agendado Exitosamente</span>
            </motion.div>
        </motion.div>
    );
}
