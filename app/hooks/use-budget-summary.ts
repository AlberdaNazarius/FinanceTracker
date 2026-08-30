import { useCallback, useEffect, useState } from "react";
import {BudgetService} from "@/service/client/budget.service";
import {BudgetSummary} from "@/types/budget-summary";

export function useBudgetSummary() {
  const [budgetsSummary, setBudgetsSummary] = useState<BudgetSummary[]>([]);
  const [ratesAvailable, setRatesAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBudgetsSummary = useCallback(async () => {
    try {
      setLoading(true);
      const result = await BudgetService.getBudgetSummary();
      setBudgetsSummary(result.data ?? []);
      setRatesAvailable(result.ratesAvailable);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgetsSummary();
  }, [fetchBudgetsSummary]);

  return {
    budgetsSummary,
    ratesAvailable,
    loading,
    error,
    refetch: fetchBudgetsSummary
  };
}