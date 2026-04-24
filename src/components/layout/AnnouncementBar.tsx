import { CreditCard, Truck } from 'lucide-react';

/**
 * Barra de anuncios fina y fija en el borde superior del sitio.
 * Comunica las 2 ofertas clave (cuotas + envío gratis) apenas entra el usuario.
 *
 * Altura: 28px mobile, 32px desktop. El Navbar se desplaza esa altura hacia abajo
 * en [Navbar.tsx]. Presente en PublicLayout (no en Checkout/Success).
 */
export function AnnouncementBar() {
    return (
        <div
            role="complementary"
            aria-label="Promociones activas"
            className="fixed top-0 left-0 w-full h-7 md:h-8 z-[50] bg-monza-red text-white flex items-center justify-center overflow-hidden"
        >
            <div className="flex items-center gap-3 md:gap-6 px-3">
                <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest whitespace-nowrap">
                    <CreditCard className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                    3 Cuotas sin Interés
                </span>
                <span className="w-px h-3 md:h-3.5 bg-white/35 shrink-0" aria-hidden="true" />
                <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest whitespace-nowrap">
                    <Truck className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                    <span className="hidden md:inline">Envío Gratis a partir de $800.000</span>
                    <span className="md:hidden">Envío Gratis +$800.000</span>
                </span>
            </div>
        </div>
    );
}
