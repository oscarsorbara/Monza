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
