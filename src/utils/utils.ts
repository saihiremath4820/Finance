import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-700 bg-red-100 border-red-200';
    if (score >= 60) return 'text-orange-700 bg-orange-100 border-orange-200';
    if (score >= 40) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    return 'text-blue-700 bg-blue-100 border-blue-200';
};
