import { useCallback, useEffect, useState } from "react";
import { UserService } from "@/service/client/user.service";
import { ResponseBalance } from "@/types/response/response-balance";
import { DEFAULT_CURRENCY } from "@/helpers/constants";

const EMPTY: ResponseBalance = {
  total: 0,
  currency: DEFAULT_CURRENCY.code,
  locations: [],
  ratesAvailable: true,
};

export function useBalance() {
  const [balance, setBalance] = useState<ResponseBalance>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      const result = await UserService.getUserBalance();
      setBalance(result ?? EMPTY);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance
  };
}
