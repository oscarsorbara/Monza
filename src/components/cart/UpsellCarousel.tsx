import { useState, useEffect } from 'react';
import { Clock, ShoppingCart, Timer, Zap } from 'lucide-react';
import { PRODUCTS } from '@/data/productsMock';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// Configuration for Real Discount
const UPSELL_DISCOUNT_CODE = "FLASH30";
const DISCOUNT_PERCENTAGE = 0.30;

export function UpsellCarousel() {
    const { addToCart, items } = useCart();

    // Persistent Timer Logic
    const [timeLeft, setTimeLeft] = useState(() => {
        const savedExpiry = localStorage.getItem('upsellTimerExpiry');
        if (savedExpiry) {
            const remaining = Math.floor((parseInt(savedExpiry, 10) - Date.now()) / 1000);
            return remaining > 0 ? remaining : 0;
        }
        return 420;
    });

    const [isExpired, setIsExpired] = useState(timeLeft <= 0);

    // Initialize/Check Timer on Mount
    useEffect(() => {
        const savedExpiry = localStorage.getItem('upsellTimerExpiry');
        if (!savedExpiry) {
            const newExpiry = Date.now() + (420 * 1000);
            localStorage.setItem('upsellTimerExpiry', newExpiry.toString());
        }
    }, []);

    // Selection Logic (Smart Brand Matching)
    const cartItemIds = items.map(i => i.id);
    const cartBrand = items.length > 0 ? (items[0].name.includes('BMW') ? 'BMW' : items[0].name.includes('Audi') ? 'Audi' : items[0].name.includes('Mercedes') ? 'Mercedes' : '') : '';

    let selectedProducts = PRODUCTS.filter(p =>
        !cartItemIds.includes(p.id) &&
        (cartBrand ? p.name.includes(cartBrand) || p.brand?.includes(cartBrand) : true)
    );

    if (selectedProducts.length < 3) {
        const remaining = PRODUCTS.filter(p => !cartItemIds.includes(p.id) && !selectedProducts.map(sp => sp.id).includes(p.id));
        selectedProducts = [...selectedProducts, ...remaining];
    }

    const upsellProducts = (selectedProducts.length >= 3 ? selectedProducts : PRODUCTS).slice(0, 3);

    useEffect(() => {
        if (isExpired) return;

        const timer = setInterval(() => {
            const savedExpiry = localStorage.getItem('upsellTimerExpiry');
            if (savedExpiry) {
                const remaining = Math.floor((parseInt(savedExpiry, 10) - Date.now()) / 1000);
                if (remaining <= 0) {
                    setTimeLeft(0);
                    setIsExpired(true);
                    clearInterval(timer);
                } else {
                    setTimeLeft(remaining);
                }
            } else {
                setTimeLeft(prev => prev - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [isExpired]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddUpsell = (originalProduct: typeof PRODUCTS[0]) => {
        // Calculate discounted price locally for Cart display
        const discountedPrice = originalProduct.price * (1 - DISCOUNT_PERCENTAGE);

        // Create enhanced product object with Discount Info
        const productWithDiscount = {
            ...originalProduct,
            price: discountedPrice, // Override price for Cart Total calculation
            originalPrice: originalProduct.price, // Keep original for reference
            discountCode: UPSELL_DISCOUNT_CODE, // Attach code for Checkout
        };

        addToCart(productWithDiscount, 1);
    };

    return (
        <section className={`mb-12 border-[3px] rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl ${isExpired ? 'border-gray-800 opacity-60 grayscale' : 'border-monza-red bg-carbon-900 border-opacity-100'}`}>
            <div className={`text-white font-bold text-sm tracking-widest uppercase p-2 text-center ${isExpired ? 'bg-gray-800' : 'bg-monza-red'}`}>
                {isExpired ? 'Oferta Finalizada' : 'OFERTA DE ÚNICA VEZ'}
            </div>

            {/* Header */}
            <div className={`p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b ${isExpired ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-monza-red/10 to-transparent border-monza-red/20'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isExpired ? 'bg-gray-700 text-gray-400' : 'bg-monza-red text-white animate-pulse'}`}>
                        {isExpired ? <Clock size={20} /> : <Zap size={20} />}
                    </div>
                    <div>
                        <h3 className={`font-bold uppercase tracking-wider ${isExpired ? 'text-gray-400' : 'text-white'}`}>
                            {isExpired ? 'Oferta Expirada' : `Descuento Especial - ${(DISCOUNT_PERCENTAGE * 100).toFixed(0)}% OFF`}
                        </h3>
                        {!isExpired && (
                            <p className="text-xs text-monza-red font-bold">
                                Antes de finalizar tu compra
                            </p>
                        )}
                    </div>
                </div>

                <div className={`flex items-center gap-2 font-mono text-2xl font-black ${isExpired ? 'text-gray-600' : 'text-monza-red'}`}>
                    <Timer size={24} />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Carousel Grid */}
            <div className="grid md:grid-cols-3 gap-4 p-6">
                {upsellProducts.map((product) => {
                    const discountPrice = product.price * (1 - DISCOUNT_PERCENTAGE);

                    return (
                        <div key={product.id} className="bg-carbon-950 border border-white/5 rounded-xl p-4 flex flex-col group relative overflow-hidden">
                            {/* Discount Badge */}
                            {!isExpired && (
                                <div className="absolute top-0 right-0 bg-monza-red text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
                                    -{(DISCOUNT_PERCENTAGE * 100).toFixed(0)}%
                                </div>
                            )}

                            <div className="h-32 mb-4 overflow-hidden rounded-lg bg-white/5 relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${!isExpired && 'group-hover:scale-110'}`}
                                />
                            </div>

                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-gray-200 leading-tight mb-1 line-clamp-2">
                                    {product.name}
                                </h4>
                                <p className="text-xs text-gray-500 mb-3">{product.brand}</p>

                                <div className="flex items-end gap-2 mb-4">
                                    <span className={`text-lg font-bold ${isExpired ? 'text-gray-500' : 'text-monza-red'}`}>
                                        ${formatPrice(discountPrice)}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through mb-1">
                                        ${formatPrice(product.price)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                className={`w-full ${isExpired ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-monza-red hover:bg-red-700 text-white border-none'}`}
                                onClick={() => !isExpired && handleAddUpsell(product)}
                                disabled={isExpired}
                            >
                                <ShoppingCart size={14} className="mr-2" />
                                {isExpired ? 'Expirado' : 'Agregar Ahora'}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
