import {SupabaseClient} from "@supabase/supabase-js";

export const BASE_CODE = "EUR";

// Rates are quoted per 1 EUR. The upstream package is versioned by date, which
// is what makes historical lookups possible.
const SOURCES = [
  (date: string) =>
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/eur.json`,
  (date: string) =>
    `https://${date}.currency-api.pages.dev/v1/currencies/eur.json`,
];

const toDateOnly = (value: string | Date): string =>
  (value instanceof Date ? value.toISOString() : value).split("T")[0];

const fetchUpstream = async (date: string): Promise<Record<string, number> | null> => {
  for (const buildUrl of SOURCES) {
    try {
      const response = await fetch(buildUrl(date), {
        next: {revalidate: 60 * 60 * 24},
      });

      if (!response.ok) continue;

      const payload = await response.json();
      const rates = payload?.eur;

      if (rates && typeof rates === "object") return rates as Record<string, number>;
    } catch {
      // Fall through to the next source.
    }
  }

  return null;
}

/**
 * Rates for one day, cached in the database so a given transaction always
 * normalises to the same number. Falls back to the most recent earlier day the
 * cache holds, which covers dates the upstream has no snapshot for.
 */
export const getRatesForDate = async (
  supabase: SupabaseClient,
  date: string | Date,
): Promise<Record<string, number> | null> => {
  const rateDate = toDateOnly(date);

  const {data: cached} = await supabase
    .from("exchange_rate_daily")
    .select("code, rate")
    .eq("rate_date", rateDate);

  if (cached && cached.length > 0) {
    return Object.fromEntries(cached.map((row) => [row.code, Number(row.rate)]));
  }

  const fetched = await fetchUpstream(rateDate);

  if (fetched) {
    await supabase.from("exchange_rate_daily").insert(
      Object.entries(fetched).map(([code, rate]) => ({
        rate_date: rateDate,
        code,
        rate,
      })),
    );

    return fetched;
  }

  const {data: previous} = await supabase
    .from("exchange_rate_daily")
    .select("rate_date")
    .lte("rate_date", rateDate)
    .order("rate_date", {ascending: false})
    .limit(1)
    .maybeSingle();

  if (!previous?.rate_date) return null;

  const {data: fallback} = await supabase
    .from("exchange_rate_daily")
    .select("code, rate")
    .eq("rate_date", previous.rate_date);

  if (!fallback?.length) return null;

  return Object.fromEntries(fallback.map((row) => [row.code, Number(row.rate)]));
}

/** Value of `amount` in the base currency, at the rates of a specific day. */
export const toBaseAmount = (
  amount: number,
  code: string,
  rates: Record<string, number> | null,
): number | null => {
  if (!rates) return null;

  const rate = rates[code.toLowerCase()] ?? rates[code];

  if (!rate) return null;

  return Math.round((amount / rate) * 1e6) / 1e6;
}
