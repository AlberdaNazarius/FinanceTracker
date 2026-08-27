import {ExchangeRates} from "@/types/exchange-rates";

// fawazahmed0/exchange-api — free, no API key, covers UAH (unlike ECB-backed sources).
const SOURCES = [
  (base: string) =>
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`,
  (base: string) =>
    `https://latest.currency-api.pages.dev/v1/currencies/${base}.json`,
];

const REVALIDATE_SECONDS = 60 * 60;

export const fetchExchangeRates = async (
  baseCode: string,
): Promise<ExchangeRates | null> => {
  const base = baseCode.toLowerCase();

  if (!/^[a-z]{3}$/.test(base)) {
    return null;
  }

  for (const buildUrl of SOURCES) {
    try {
      const response = await fetch(buildUrl(base), {
        next: {revalidate: REVALIDATE_SECONDS},
      });

      if (!response.ok) continue;

      const payload = await response.json();
      const rates = payload?.[base];

      if (rates && typeof rates === "object") {
        return {base: baseCode.toUpperCase(), rates};
      }
    } catch {
      // Fall through to the next source.
    }
  }

  return null;
}
