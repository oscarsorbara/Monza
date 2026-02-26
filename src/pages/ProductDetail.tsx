import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useVehicle } from '@/context/VehicleContext';
import { checkCompatibility } from '@/lib/compatibility';
import { Check, AlertTriangle, Plus, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductGallery } from '@/components/product/ProductGallery';
import { Accordion } from '@/components/ui/Accordion';
import { InlineVehicleSelector } from '@/components/vehicle/InlineVehicleSelector';
import { formatPrice } from '@/lib/utils';

export default function ProductDetail() {
    const { id } = useParams();
    const { products } = useProduct();
    // Match by handle (preferred) or ID (fallback)
    const product = products.find(p => p.handle === id || p.id === id || (id && p.id.endsWith(`/${id}`)));
    const { addToCart } = useCart();
    const { currentVehicle } = useVehicle();

    if (!product) return <div className="pt-32 text-center text-2xl font-bold">Producto no encontrado</div>;

    const status = checkCompatibility(product, currentVehicle);
    const isCompatible = status === 'EXACT_MATCH' || status === 'UNIVERSAL';

    // Variant Selection Logic
    // Default to the variant with the lowest price (usually "Sin instalación")
    const [selectedVariant] = useState(() => {
        if (!product.variants || product.variants.length === 0) {
            return {
                id: product.id,
                title: 'Default',
                price: product.price,
                compareAtPrice: product.compareAtPrice
            };
        }
        return product.variants.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));
    });

    const handleAddToCart = () => {
        if (!product) return;

        // Base variant only since installation option is removed
        const variantToAdd = selectedVariant;

        addToCart(
            {
                ...product,
                id: variantToAdd.id,
                price: variantToAdd.price,
                compareAtPrice: product.compareAtPrice,
                image: product.image
            },
            1, // quantity
            currentVehicle ? `${currentVehicle.make} ${currentVehicle.model} ${currentVehicle.year}` : undefined
        );
    };

    return (
        <div className="min-h-screen text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* ... (Visual Side kept same) ... */}
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
                <div className="px-4 py-8 md:px-6 md:py-12 lg:py-32 lg:px-20 max-w-2xl pb-32 md:pb-12">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* ... (Header/Category kept same) ... */}
                        <div className="flex items-center gap-4 mb-6">
                            {product.category && (
                                <span className="px-3 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider">
                                    {product.category}
                                </span>
                            )}
                            {product.stock < 5 && (
                                <span className="text-monza-red text-xs font-bold uppercase tracking-wider">
                                    Poco Stock
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-none">
                            {product.name}
                        </h1>

                        <div className="mb-6 md:mb-4">
                            <div className="flex items-center gap-4">
                                {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
                                    <>
                                        <div className="flex flex-col items-start">
                                            <span className="text-xl md:text-2xl text-gray-400 line-through decoration-red-500/50 decoration-2">
                                                ${formatPrice(selectedVariant.compareAtPrice)}
                                            </span>
                                            <span className="bg-monza-red text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded">
                                                OFFERTA {Math.round(((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice) * 100)}% OFF
                                            </span>
                                        </div>
                                    </>
                                )}
                                <span className="text-5xl md:text-4xl text-white font-black tracking-tight">
                                    ${formatPrice(selectedVariant.price)}
                                </span>
                            </div>

                            {/* Trust Badges - Mobile Optimized */}
                            <div className="flex items-center gap-4 mt-6 md:mt-4 text-sm text-gray-300 md:hidden">
                                <div className="flex items-center gap-2 font-medium">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                    <span>Garantía Oficial</span>
                                </div>
                                <div className="flex items-center gap-2 font-medium">
                                    <Truck className="w-5 h-5 text-monza-red" />
                                    <span>Envío Asegurado</span>
                                </div>
                            </div>

                            {product.unitPrice && (
                                <div className="text-sm text-gray-400 mt-2 font-medium">
                                    ${formatPrice(product.unitPrice)}
                                    {product.unitPriceMeasurement ? ` / ${product.unitPriceMeasurement.referenceUnit || 'unidad'}` : ' por unidad'}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 items-center fixed bottom-0 left-0 w-full p-4 bg-carbon-950/95 backdrop-blur-md border-t border-white/10 z-[100] md:relative md:p-0 md:bg-transparent md:backdrop-blur-none md:border-t-0 md:z-auto md:mb-6">
                            <Button size="lg" onClick={handleAddToCart} className="w-full md:flex-1 bg-monza-red md:bg-white text-white md:text-black hover:bg-white hover:text-black md:hover:bg-gray-200 h-14 min-h-[56px] md:h-14 text-lg font-bold uppercase tracking-wider shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-none">
                                Agregar al Carrito <Plus className="ml-2 w-5 h-5" />
                            </Button>
                        </div>

                        {/* Installation Option temporarily removed for launch */}
                        {/* 
                        {product.variants && product.variants.length > 1 && (
                            ...
                        )} 
                        */}

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
                                            {isCompatible ? 'Compatible con tu vehículo' : 'No compatible con tu vehículo'}
                                        </h4>
                                        <p className="text-sm text-gray-300 mt-1">
                                            {isCompatible ? 'Este producto se ajusta perfectamente a tu' : 'Este producto no es adecuado para tu'} <span className="font-bold text-white">{currentVehicle.year} {currentVehicle.make} {currentVehicle.model} {currentVehicle.variant !== 'Base' ? currentVehicle.variant : ''}</span>.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 mb-12 md:mb-12">
                            {/* Mobile specific bullet points */}
                            <ul className="mb-8 space-y-3 text-sm text-gray-300 md:hidden font-medium bg-white/5 p-4 rounded-xl border border-white/10">
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-monza-red shrink-0" /> Envío a todo el país garantizado</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-monza-red shrink-0" /> Calidad OEM Premium</li>
                                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-monza-red shrink-0" /> Asesoramiento especializado</li>
                            </ul>

                            {/* Mobile Accordions */}
                            <div className="md:hidden space-y-1">
                                <Accordion title="Descripción del Producto" defaultOpen={true}>
                                    <div
                                        className="prose prose-invert text-gray-400 [&>p]:mb-4 [&>ul]:mb-4 [&>li]:mb-1 text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                </Accordion>
                                <Accordion title="Especificaciones">
                                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                                        <li>Materiales de alta durabilidad y terminación.</li>
                                        <li>Ajuste perfecto sin modificaciones (Plug & Play).</li>
                                        <li>Revisar panel de compatibilidad.</li>
                                    </ul>
                                </Accordion>
                                <Accordion title="Garantía y Envío">
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Todos nuestros productos cuentan con garantía de fábrica ante defectos de manufactura. Realizamos despachos a través de transportes asegurados. Recomendamos instalación en talleres especializados.
                                    </p>
                                </Accordion>
                            </div>

                            {/* Desktop original description */}
                            <div
                                className="hidden md:block prose prose-invert prose-lg text-gray-400 [&>p]:mb-6 [&>ul]:mb-6 [&>li]:mb-2"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
