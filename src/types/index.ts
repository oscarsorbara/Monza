export type VehiclePart = 'Make' | 'Model' | 'Year' | 'Engine';

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    engine: string; // e.g., "V6 3.5L", "I4 2.0L Turbo"
    trim?: string;
    variant?: string; // DB Column mapping for engine/trim
}

export interface CompatibilityRule {
    make: string;
    model: string | 'All';
    yearStart: number | null; // null means "from beginning"
    yearEnd: number | null; // null means "to present"
    engines: string[] | 'All';
    notes?: string;
}

export type CompatibilityStatus = 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'INCOMPATIBLE' | 'UNIVERSAL';

export interface Product {
    id: string;
    name: string;
    handle: string;
    sku: string;
    price: number;
    category: ProductCategory;
    image: string;
    images: string[];
    description: string;
    stock: number;
    rating: number;
    reviewsCount: number;
    compatibility: CompatibilityRule[];
    specs: Record<string, string>;
    brand: string; // e.g. Brembo, Bosch
    isUniversal?: boolean;
    variantId?: string; // Shopify Variant ID for Checkout
    collections?: string[]; // List of collection handles
    compareAtPrice?: number;
    unitPrice?: number;
    unitPriceMeasurement?: {
        measuredType?: string;
        quantityUnit?: string;
        quantityValue?: number;
        referenceUnit?: string;
        referenceValue?: number;
    };
}

export type ProductCategory = string;

export interface CartItem extends Product {
    quantity: number;
    vehicleId?: string; // The vehicle this part was bought for
    discountCode?: string; // e.g. "FLASH30"
    originalPrice?: number; // Store original price if discounted
    attributes?: Record<string, string>; // e.g. { "Installation": "Requested" }
}

export interface Collection {
    id: string;
    name: string;
    handle: string;
    image: string;
    description: string;
}
