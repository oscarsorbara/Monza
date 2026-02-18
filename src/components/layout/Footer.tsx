import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-carbon-950 border-t border-white/5 pt-20 pb-10 relative z-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <img src="/monza-logo.png" alt="MONZA" className="h-8 md:h-10 w-auto object-contain" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Elevando el rendimiento de tu vehículo con piezas premium y precisión alemana. Est. 2026.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-monza-red hover:text-white hover:border-monza-red transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-monza-red hover:text-white hover:border-monza-red transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-monza-red hover:text-white hover:border-monza-red transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 underline decoration-monza-red decoration-2 underline-offset-8">Explorar</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Inicio</Link></li>
                            <li><Link to="/catalog" className="text-gray-400 hover:text-white transition-colors text-sm">Catálogo</Link></li>
                            <li><Link to="/catalog?category=Escapes" className="text-gray-400 hover:text-white transition-colors text-sm">Escapes</Link></li>
                            <li><Link to="/catalog?category=Suspension" className="text-gray-400 hover:text-white transition-colors text-sm">Suspensión</Link></li>
                            <li><Link to="/account" className="text-gray-400 hover:text-white transition-colors text-sm">Mi Cuenta</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 underline decoration-monza-red decoration-2 underline-offset-8">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin size={18} className="text-monza-red shrink-0" />
                                <span>Av. Libertador 1234, <br />Buenos Aires, Argentina</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone size={18} className="text-monza-red shrink-0" />
                                <span>+54 9 11 1234-5678</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail size={18} className="text-monza-red shrink-0" />
                                <span>info@monzars.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 underline decoration-monza-red decoration-2 underline-offset-8">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Suscribite para recibir novedades y ofertas exclusivas.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Tu email"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-monza-red w-full"
                            />
                            <button className="bg-monza-red text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition-colors">
                                OK
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        © 2026 MONZA Racing Parts. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Privacidad</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Términos</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Envíos</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
