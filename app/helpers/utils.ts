import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {DEFAULT_CURRENCY} from "@/helpers/constants";
import {BudgetSummary} from "@/types/budget-summary";
import { DateRange } from "@/enum/date-range";

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
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount);
}

export const getCurrencySymbol = (currencyCode: string | undefined) => {
  const code = currencyCode ?? DEFAULT_CURRENCY.code;

  const parts = new Intl.NumberFormat("en", {
    style: "currency",
    currency: code,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).formatToParts(0);
  const symbolPart = parts.find(part => part.type === "currency");
  return symbolPart ? symbolPart.value : code;
}

const toDateInput = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const normalizeDateToInput = (value?: string | Date | null): string => {
  if (!value) {
    return toDateInput(new Date());
  }

  if (value instanceof Date) {
    return toDateInput(value);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return toDateInput(new Date(value));
};

export const dateInputToTimestamp = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);
  const now = new Date();

  return new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );
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

export const getDateRange = (range: DateRange): Date | null => {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  switch (range) {
    case DateRange.WEEK: {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case DateRange.MONTH: {
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
        0,
        0,
        0,
        0
      );
    }
    case DateRange.ALL:
      return null;
    default:
      return null;
  }
};