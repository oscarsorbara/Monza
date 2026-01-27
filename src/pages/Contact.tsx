import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Mail, Loader2, Send } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { AppointmentSection } from '@/components/service/AppointmentSection';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For now, just show a success message since we don't have a backend mailer yet
        // In a real app, this would POST to an edge function
        console.log({ name, email, message });

        addToast('Mensaje enviado con éxito. Te contactaremos pronto.', 'success');
        setName('');
        setEmail('');
        setMessage('');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-carbon-950 pt-32 pb-20">
            {/* Header / Hero */}
            <div className="relative h-[40vh] min-h-[400px] mb-20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop"
                        alt="Contact Monza"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-carbon-950/20 via-carbon-950/60 to-carbon-950" />
                </div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black italic text-white mb-6 tracking-tighter">
                            CONTACTO
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                            Estamos aquí para asesorarte. Ponete en contacto con nuestro equipo de expertos para llevar tu auto al siguiente nivel.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-carbon-900/50 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-3xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-monza-red/20 flex items-center justify-center text-monza-red">
                                <Mail size={24} />
                            </div>
                            <h2 className="text-3xl font-bold italic text-white tracking-tight">ENVIANOS UN MENSAJE</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-14 bg-carbon-800 border-none rounded-xl px-5 text-white focus:ring-2 focus:ring-monza-red transition-all shadow-inner"
                                    placeholder="Tu Nombre"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 bg-carbon-800 border-none rounded-xl px-5 text-white focus:ring-2 focus:ring-monza-red transition-all shadow-inner"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Mensaje</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                    className="w-full bg-carbon-800 border-none rounded-xl p-5 text-white focus:ring-2 focus:ring-monza-red transition-all resize-none shadow-inner"
                                    placeholder="¿En qué podemos ayudarte?"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-white text-black hover:bg-gray-200 h-14 font-bold tracking-widest text-sm"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-4 h-4" />}
                                {isLoading ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Info / Decor */}
                    <div className="space-y-12">
                        <div className="prose prose-invert">
                            <h3 className="text-2xl font-bold text-white mb-4">¿Por qué elegir Monza?</h3>
                            <p className="text-gray-400 leading-relaxed">
                                En Monza Racing Parts, no solo vendemos piezas; ofrecemos soluciones de rendimiento completas. Nuestro equipo técnico está altamente capacitado para asesorarte sobre la mejor configuración para tu vehículo específico.
                            </p>
                            <p className="text-gray-400 leading-relaxed mt-4">
                                Trabajamos directamente con los mejores fabricantes del mundo para asegurar autenticidad, garantía y fitment perfecto.
                            </p>
                        </div>

                        <div className="bg-monza-red/5 border border-monza-red/20 p-8 rounded-2xl">
                            <h4 className="text-monza-red font-bold text-lg mb-2">Soporte Técnico Especializado</h4>
                            <p className="text-gray-400 text-sm">
                                ¿Dudas sobre compatibilidad? ¿Necesitas ayuda con la instalación? Envíanos los detalles de tu vehículo y te responderemos en menos de 24 horas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reused Appointment Section */}
            <div className="mt-20">
                <AppointmentSection />
            </div>
        </div>
    );
}
