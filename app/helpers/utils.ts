import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {DEFAULT_CURRENCY} from "@/helpers/constants";

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

export const formatMoney = (amount: number | null | undefined, code: string | null | undefined) => {
  if (!amount && amount !== 0) return 'N/A';

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: code ?? DEFAULT_CURRENCY.code,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount);
}

export const getCurrencySymbol = (currencyCode: string | undefined) => {
  const code = currencyCode ?? DEFAULT_CURRENCY.code;

    const parts = new Intl.NumberFormat("en", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).formatToParts(0);
  const symbolPart = parts.find(part => part.type === "currency");
  return symbolPart ? symbolPart.value : code;
}