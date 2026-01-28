import type { Product } from '@/types';
import { checkCompatibility } from '@/lib/compatibility';
import { useVehicle } from '@/context/VehicleContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { getProductId, formatPrice } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { currentVehicle } = useVehicle();
    const { addToCart } = useCart();

    const status = checkCompatibility(product, currentVehicle);

    const isCompatible = status === 'EXACT_MATCH' || status === 'UNIVERSAL';
    const isIncompatible = status === 'INCOMPATIBLE';

    return (
        <div className="bg-carbon-800 border border-carbon-700 rounded-xl overflow-hidden hover:border-carbon-500 transition-all duration-300 group flex flex-col h-full">
            {/* Image Area */}
            {/* Image Area */}
            <Link to={`/product/${getProductId(product.id)}`} className="block relative h-48 overflow-hidden bg-white/5">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.stock < 5 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Poco Stock
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{product.brand}</span>
                    <Link to={`/product/${getProductId(product.id)}`}>
                        <h3 className="text-lg font-bold text-white leading-tight hover:text-monza-red transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-300">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviewsCount})</span>
                </div>

                {/* Compatibility Badge */}
                {currentVehicle && (
                    <div className={clsx(
                        "flex items-center gap-2 text-xs font-medium p-2 rounded mb-4",
                        isCompatible ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    )}>
                        {isCompatible ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {status === 'EXACT_MATCH' ? 'Compatible con tu vehículo' :
                            status === 'UNIVERSAL' ? 'Universal' :
                                'No compatible'}
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-white">${formatPrice(product.price)}</span>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => {
                            addToCart(product, 1, currentVehicle?.id);
                            // Toast replaced by CartNotification component
                        }}
                        disabled={isIncompatible && false} // Allow adding but maybe warn? For now allow.
                        variant={isIncompatible ? 'secondary' : 'primary'}
                    >
                        Agregar
                    </Button>
                </div>
            </div>
        </div>
    );
}
