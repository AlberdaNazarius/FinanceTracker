export type BudgetSummary = {
  budgetId: string;
  budget: number;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  spent: number;
  remaining: number;
  usedPercentage: number;
}