import { useCallback, useEffect, useState } from "react";
import { MoneyLocationService } from "@/service/client/money-location.service";
import { MoneyLocation } from "@/types/money-location";

export function useMoneyLocations() {
  const [locations, setLocations] = useState<MoneyLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const result = await MoneyLocationService.getLocations();
      setLocations(result.data ?? []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    setLocations,
    loading,
    error,
    refetch: fetchLocations
  };
}
