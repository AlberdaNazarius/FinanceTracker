import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {DEFAULT_CURRENCY} from "@/helpers/constants";
import {BudgetSummary} from "@/types/budget-summary";

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

export const normalizeDateToInput = (value?: string | Date | null): string => {
  if (!value) {
    return new Date().toISOString().split("T")[0];
  }

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return value.split("T")[0];
};

export function calculateBudgetTotals(budgets: BudgetSummary[]) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0);

  const overallPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const isOverBudget = totalSpent > totalBudget;

  return {
    totalBudget,
    totalSpent,
    totalRemaining,
    overallPercentage,
    isOverBudget
  };
}