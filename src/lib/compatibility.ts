import type { Product, Vehicle, CompatibilityStatus } from '@/types';

export function checkCompatibility(product: Product, vehicle: Vehicle | null): CompatibilityStatus {
    if (!vehicle) return 'UNIVERSAL';

    // Universal parts fit everything
    if (product.isUniversal) return 'UNIVERSAL';

    // Check strict compatibility rules
    for (const rule of product.compatibility) {
        const isMakeMatch = rule.make === 'All' || rule.make === vehicle.make;
        const isModelMatch = rule.model === 'All' || rule.model === vehicle.model;

        // Year check
        const isYearMatch = (
            (!rule.yearStart || vehicle.year >= rule.yearStart) &&
            (!rule.yearEnd || vehicle.year <= rule.yearEnd)
        );

        // Engine/Variant check
        const isEngineMatch = rule.engines === 'All' ||
            rule.engines.includes(vehicle.engine) ||
            (vehicle.variant && rule.engines.includes(vehicle.variant));

        if (isMakeMatch && isModelMatch && isYearMatch && isEngineMatch) {
            return 'EXACT_MATCH';
        }
    }

    return 'INCOMPATIBLE';
}

export function getCompatibilityText(status: CompatibilityStatus, vehicle: Vehicle | null): string {
    if (!vehicle) return '';
    switch (status) {
        case 'EXACT_MATCH':
            return `Compatible with your ${vehicle.year} ${vehicle.model}`;
        case 'UNIVERSAL':
            return 'Universal Fit';
        case 'INCOMPATIBLE':
            return `NOT Compatible with ${vehicle.year} ${vehicle.model}`;
        default:
            return '';
    }
}
