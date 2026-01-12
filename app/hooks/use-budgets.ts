import { useCallback, useEffect, useState } from "react";
import { BudgetService } from "@/service/client/budget.service";
import { BudgetWithCategory } from "@/types/budget";

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const result = await BudgetService.getBudgets();
      setBudgets(result.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets
  };
}