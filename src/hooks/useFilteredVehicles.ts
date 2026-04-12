import { useMemo } from 'react';
import { VEHICLE_DATABASE } from '@/data/vehiclesMock';
import { useProduct } from '@/context/ProductContext';

/**
 * Returns a filtered version of VEHICLE_DATABASE containing only
 * makes/models/years that have at least one compatible product.
 */
export function useFilteredVehicles() {
    const { products } = useProduct();

    const filteredDatabase = useMemo(() => {
        // Collect all compatibility rules from all non-universal products
        const rules = products.flatMap(p =>
            p.isUniversal ? [] : p.compatibility
        );

        if (rules.length === 0) return VEHICLE_DATABASE;

        // Build a set of make+model+yearRange from compatibility rules
        const filtered: typeof VEHICLE_DATABASE = {};

        for (const make of Object.keys(VEHICLE_DATABASE)) {
            const makeRules = rules.filter(r => r.make === make);
            if (makeRules.length === 0) continue;

            filtered[make] = {};

            for (const model of Object.keys(VEHICLE_DATABASE[make])) {
                const modelRules = makeRules.filter(r => r.model === model || r.model === 'All');
                if (modelRules.length === 0) continue;

                // Get original years for this model
                const originalYears = VEHICLE_DATABASE[make][model];

                // Filter years to only those covered by at least one rule
                const filteredYears: Record<string, string[]> = {};
                for (const yearStr of Object.keys(originalYears)) {
                    const year = Number(yearStr);
                    const hasMatch = modelRules.some(r => {
                        const start = r.yearStart ?? 0;
                        const end = r.yearEnd ?? 9999;
                        return year >= start && year <= end;
                    });
                    if (hasMatch) {
                        filteredYears[yearStr] = originalYears[yearStr];
                    }
                }

                if (Object.keys(filteredYears).length > 0) {
                    filtered[make][model] = filteredYears;
                }
            }

            // Remove make if no models survived
            if (Object.keys(filtered[make]).length === 0) {
                delete filtered[make];
            }
        }

        return filtered;
    }, [products]);

    return filteredDatabase;
}
