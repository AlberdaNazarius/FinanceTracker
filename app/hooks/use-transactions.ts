import { useCallback, useEffect, useState } from "react";
import {TransactionService} from "@/service/client/transaction.service";
import {ResponseTransaction} from "@/types/response/response-transaction";

export function useTransactions() {
  const [transactions, setTransactions] = useState<ResponseTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const result = await TransactionService.getTransactions();
      setTransactions(result.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions
  };
}
