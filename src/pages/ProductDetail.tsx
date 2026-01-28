import { useParams } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useVehicle } from '@/context/VehicleContext';
import { checkCompatibility } from '@/lib/compatibility';
import { Check, AlertTriangle, Info, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductGallery } from '@/components/product/ProductGallery';
import { InlineVehicleSelector } from '@/components/vehicle/InlineVehicleSelector';
import { formatPrice } from '@/lib/utils';

export default function ProductDetail() {
    const { id } = useParams();
    const { products } = useProduct();
    // Simplified ID matching for Shopify GIDs
    const product = products.find(p => p.id === id || (id && p.id.endsWith(`/${id}`)));
    const { addToCart } = useCart();
    const { currentVehicle } = useVehicle();

    if (!product) return <div className="pt-32 text-center text-2xl font-bold">Producto no encontrado</div>;

    const status = checkCompatibility(product, currentVehicle);
    const isCompatible = status === 'EXACT_MATCH' || status === 'UNIVERSAL';

    const handleAddToCart = () => {
        addToCart(product, 1, currentVehicle?.id);
        // Toast replaced by CartNotification component
    };

    return (
        <div className="min-h-screen text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Visual Side (Sticky) */}
                {/* Visual Side (Sticky) */}
                <div className="lg:sticky lg:top-0 lg:h-screen w-full bg-carbon-900 overflow-hidden relative">
                    <div className="w-full h-[60vh] lg:h-full relative">
                        <ProductGallery
                            images={product.images}
                            title={product.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-transparent lg:hidden pointer-events-none" />
                    </div>
                </div>

                {/* Content Side (Scrollable) */}
                <div className="px-6 py-12 lg:py-32 lg:px-20 max-w-2xl">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-3 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider">
                                {product.category}
                            </span>
                            {product.stock < 5 && (
                                <span className="text-monza-red text-xs font-bold uppercase tracking-wider">
                                    Poco Stock
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-none">
                            {product.name}
                        </h1>

                        <div className="text-3xl text-gray-300 font-light mb-8">
                            ${formatPrice(product.price)}
                        </div>

                        {/* Inline Vehicle Selector */}
                        <div className="mb-8">
                            <InlineVehicleSelector />
                        </div>

                        {/* Compatibility Result (Only if vehicle is selected) */}
                        <AnimatePresence>
                            {currentVehicle && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`p-4 rounded-xl mb-8 flex items-start gap-3 border ${isCompatible ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}
                                >
                                    {isCompatible ? (
                                        <div className="p-2 bg-green-500/20 rounded-full">
                                            <Check className="w-6 h-6 text-green-500" />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-red-500/20 rounded-full">
                                            <AlertTriangle className="w-6 h-6 text-red-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className={`font-black text-lg uppercase tracking-wide ${isCompatible ? 'text-green-500' : 'text-red-500'}`}>
                                            {isCompatible ? 'Compatible' : 'No Compatible'}
                                        </h4>
                                        <p className="text-sm text-gray-300 mt-1">
                                            Este producto {isCompatible ? 'se ajusta perfectamente a tu' : 'no es adecuado para tu'} <span className="font-bold text-white">{currentVehicle.year} {currentVehicle.make} {currentVehicle.model}</span>.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div
                            className="prose prose-invert prose-lg text-gray-400 mb-12 [&>p]:mb-6 [&>ul]:mb-6 [&>li]:mb-2"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />

                        <div className="flex gap-4 items-center">
                            <Button size="lg" onClick={handleAddToCart} className="flex-1 bg-white text-black hover:bg-gray-200 h-16 text-lg">
                                Agregar <Plus className="ml-2 w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="outline" className="h-16 w-16 rounded-full border-white/20">
                                <Info className="w-6 h-6" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
