import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Calendar, X, CheckCircle } from 'lucide-react';
import Cal from "@calcom/embed-react";
import { useState } from 'react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-carbon-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        {!showCalendar ? (
                            <div className="p-8 md:p-12 text-center">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
                                    <CheckCircle size={40} className="text-black" />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">
                                    ¡Compra Exitosa!
                                </h2>
                                <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                                    Tu pedido ha sido procesado. ¿Te gustaría agendar tu turno de instalación ahora mismo?
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        size="lg"
                                        className="bg-monza-red hover:bg-red-600 text-white px-8 h-14 font-black italic tracking-widest"
                                        onClick={() => setShowCalendar(true)}
                                    >
                                        AGENDAR AHORA <Calendar className="ml-2" size={20} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-white/10 hover:bg-white/5 px-8 h-14 font-bold"
                                        onClick={onClose}
                                    >
                                        MÁS TARDE
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-[80vh] max-h-[700px]">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-carbon-950">
                                    <h3 className="font-black italic uppercase tracking-tighter text-xl">Selecciona tu Turno</h3>
                                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-hidden bg-carbon-900">
                                    <Cal
                                        calLink="oscar-sorbara-xbmqr9"
                                        style={{ width: "100%", height: "100%" }}
                                        config={{ layout: 'month_view', theme: 'dark' }}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
