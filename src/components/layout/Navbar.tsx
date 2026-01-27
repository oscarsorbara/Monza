import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Navbar() {
    const { itemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-[var(--z-navbar)] text-white pointer-events-none transition-all duration-500",
                isScrolled ? "bg-carbon-950/90 border-b border-white/5 shadow-md" : "bg-transparent"
            )}
        >
            <div
                className={cn(
                    "max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500",
                    isScrolled ? "py-2 md:py-3" : "py-3 md:py-4"
                )}
            >
                {/* Logo Section */}
                <div className={cn(
                    "transition-all duration-700 ease-in-out flex items-center",
                    !isScrolled && "md:absolute md:left-1/2 md:-translate-x-1/2"
                )}>
                    <Link to="/" className="pointer-events-auto flex items-center group">
                        <img
                            src="/monza-logo.png"
                            alt="MONZA"
                            className={cn(
                                "w-auto object-contain transition-all duration-500",
                                "h-8 md:h-10"
                            )}
                        />
                    </Link>
                </div>

                {/* Left side spacer for centering balance when at top */}
                <div className="hidden md:block w-32" />

                {/* Desktop Actions */}
                <div className={cn(
                    "hidden md:flex items-center gap-6 pointer-events-auto transition-all duration-500 px-6 py-2.5 rounded-full border shadow-lg",
                    isScrolled
                        ? "bg-white/5 border-white/10 backdrop-blur-md"
                        : "bg-black/20 border-white/5 backdrop-blur-sm"
                )}>
                    <Link to="/catalog" className="text-sm font-medium hover:text-monza-red transition-colors uppercase tracking-widest">Catálogo</Link>
                    <Link to="/maintenance" className="text-sm font-medium hover:text-monza-red transition-colors uppercase tracking-widest">Mantenimiento</Link>



                    <div className="w-px h-4 bg-white/20 mx-2" />

                    <Link to="/cart" className="relative group hover:text-monza-red transition-colors">
                        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-monza-red text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    <Link to="/account" className="hover:text-monza-red transition-colors">
                        <User className="w-5 h-5 hover:scale-110 transition-transform" />
                    </Link>
                </div>

                {/* Mobile Menu Button - Pointer Events Auto */}
                <div className="md:hidden pointer-events-auto">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-black/20 backdrop-blur">
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed inset-0 bg-carbon-950 z-[100] flex flex-col items-center justify-center space-y-8 pointer-events-auto"
                        style={{
                            background: 'radial-gradient(circle at 100% 0%, rgba(220,38,38,0.1) 0%, transparent 50%), #050505'
                        }}
                    >
                        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-white hover:bg-white/10">
                            <X className="h-8 w-8" />
                        </Button>

                        <div className="flex flex-col items-center gap-6">
                            <Link to="/" className="text-4xl font-black italic hover:text-monza-red transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                            <Link to="/catalog" className="text-4xl font-black italic hover:text-monza-red transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
                            <Link to="/maintenance" className="text-4xl font-black italic hover:text-monza-red transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Mantenimiento</Link>
                            <Link to="/cart" className="text-4xl font-black italic hover:text-monza-red transition-colors uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                                Carrito <span className="text-monza-red">({itemCount})</span>
                            </Link>

                            <Link to="/account" onClick={() => setIsMenuOpen(false)} className="mt-8 flex items-center gap-2 text-gray-400 font-medium border border-white/10 px-6 py-3 rounded-full hover:bg-white/5 transition-colors">
                                <User className="w-5 h-5" />
                                <span>Mi Cuenta</span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
