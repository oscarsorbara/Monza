import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
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
                isScrolled ? "bg-carbon-950/60 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
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
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-carbon-950 z-[var(--z-overlay)] flex flex-col items-center justify-center space-y-8 pointer-events-auto">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6">
                        <X className="h-8 w-8" />
                    </Button>

                    <Link to="/" className="text-4xl font-black italic hover:text-monza-red transition-colors" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                    <Link to="/catalog" className="text-4xl font-black italic hover:text-monza-red transition-colors" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
                    <Link to="/maintenance" className="text-4xl font-black italic hover:text-monza-red transition-colors" onClick={() => setIsMenuOpen(false)}>Mantenimiento</Link>

                    <Link to="/cart" className="text-4xl font-black italic hover:text-monza-red transition-colors" onClick={() => setIsMenuOpen(false)}>Carrito ({itemCount})</Link>
                </div>
            )}
        </nav>
    );
}
