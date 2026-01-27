import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const { registerWithPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            await registerWithPassword(email, password, name);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Error al crear la cuenta. Intenta nuevamente.');
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-carbon-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl text-center">
                    <h2 className="text-2xl font-black italic text-white uppercase mb-4">¡Casi listo!</h2>
                    <p className="text-gray-400 mb-6">Hemos enviado un email de confirmación a <strong>{email}</strong>.<br />Por favor confirma tu cuenta para poder iniciar sesión.</p>
                    <Button onClick={() => navigate('/login')} className="w-full bg-monza-red font-black italic">Ir al Login</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-12">
                    <img src="/images/monza-logo-hero.png" alt="MONZA" className="h-16 mx-auto mb-6 mix-blend-screen" />
                    <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">Crear Cuenta</h1>
                </div>

                <div className="bg-carbon-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-monza-red outline-none transition-all"
                                placeholder="Tu nombre"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-monza-red outline-none transition-all"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-monza-red outline-none transition-all"
                                placeholder="******"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-bold text-center">{error}</p>
                        )}

                        <Button type="submit" className="w-full bg-monza-red h-14 text-lg font-black italic uppercase tracking-widest">
                            Registrarse
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            ¿Ya tenés cuenta? <Link to="/login" className="text-monza-red hover:underline font-bold">Iniciá sesión</Link>
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <Link to="/catalog" className="text-gray-400 hover:text-white text-sm">
                            ← Continuar como invitado
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
