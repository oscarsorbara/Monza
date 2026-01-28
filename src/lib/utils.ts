import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getProductId(gid: string): string {
    if (!gid) return '';
    if (gid.includes('/')) {
        return gid.split('/').pop() || gid;
    }
    return gid;
}

export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}
