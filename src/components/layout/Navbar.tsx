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
                    <Link to="/maintenance" className="text-sm font-medium hover:text-monza-red transition-colors uppercase tracking-widest">Contacto</Link>



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

            {/* Mobile Menu - Side Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="md:hidden fixed inset-y-0 right-0 w-[80%] max-w-sm bg-carbon-950 border-l border-white/10 z-[100] shadow-2xl flex flex-col p-8 pointer-events-auto"
                            style={{
                                backgroundImage: 'linear-gradient(to bottom, rgba(220,38,38,0.05), transparent)'
                            }}
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Menú</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="text-white hover:bg-white/10 rounded-full">
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            <div className="flex flex-col gap-8 flex-1">
                                <Link to="/" className="text-3xl font-bold italic hover:text-monza-red transition-colors uppercase tracking-tight" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                                <div className="h-px bg-white/5 w-full" />
                                <Link to="/catalog" className="text-3xl font-bold italic hover:text-monza-red transition-colors uppercase tracking-tight" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
                                <div className="h-px bg-white/5 w-full" />
                                <Link to="/maintenance" className="text-3xl font-bold italic hover:text-monza-red transition-colors uppercase tracking-tight" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
                                <div className="h-px bg-white/5 w-full" />
                                <Link to="/cart" className="text-3xl font-bold italic hover:text-monza-red transition-colors uppercase tracking-tight flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                                    Carrito
                                    {itemCount > 0 && <span className="bg-monza-red text-white text-xs font-bold px-2 py-1 rounded-full">{itemCount}</span>}
                                </Link>
                            </div>

                            <div className="mt-auto">
                                <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-white font-medium bg-white/5 border border-white/10 px-6 py-4 rounded-xl hover:bg-white/10 transition-colors w-full justify-center">
                                    <User className="w-5 h-5" />
                                    <span>Mi Cuenta</span>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
