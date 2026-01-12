import { Category } from "./category";

export type Budget = {
  id: string;
  category: Category;
  amount: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export type BudgetRequest = {
  categoryId: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
}