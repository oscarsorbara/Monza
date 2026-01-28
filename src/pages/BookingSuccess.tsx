
import { AppointmentSection } from '@/components/service/AppointmentSection';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookingSuccess() {
    return (
        <div className="min-h-screen bg-carbon-950 pt-32 pb-20">
            <div className="container mx-auto px-4 text-center mb-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in-up">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>

                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-4 animate-fade-in-up delay-100">
                    ¡GRACIAS POR TU COMPRA!
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 animate-fade-in-up delay-200">
                    Tu orden ha sido procesada exitosamente. Ahora puedes agendar tu turno de instalación con nuestros técnicos certificados.
                </p>

                <div className="flex justify-center gap-4 animate-fade-in-up delay-300">
                    <Link to="/catalog">
                        <Button variant="outline">Volver al Catálogo</Button>
                    </Link>
                </div>
            </div>

            {/* This section will be forced open */}
            <AppointmentSection unlocked={true} />
        </div>
    );
}
