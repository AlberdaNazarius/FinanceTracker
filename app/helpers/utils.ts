import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const formatDate = (dateString: Date | null): string => {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatMoney = (amount: number | null, code: string | null) => {
  if (amount === null || code === null) return 'N/A';
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: code,
  }).format(amount);
}