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
    // Force usage of '.' for thousands by formatting as US (which uses commas) and replacing them
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).replace(/,/g, '.');
}
