import { useEffect, useState } from "react";
import { ExchangeRateService } from "@/service/client/exchange-rate.service";
import { ExchangeRates } from "@/types/exchange-rates";

export function useExchangeRates(base?: string) {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!base) return;

    let mounted = true;

    ExchangeRateService.getRates(base)
      .then((result) => {
        if (!mounted) return;
        setRates(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load exchange rates:", error);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [base]);

  return { rates, loading };
}
