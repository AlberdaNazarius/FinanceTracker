export type Budget = {
  id: string;
  category_id: string;
  amount: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export type BudgetCreate = Omit<Budget, "id" | "created_at" | "updated_at">

export type BudgetUpdate = Omit<Budget, "id" | "created_at">;

