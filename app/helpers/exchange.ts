import {ExchangeRates} from "@/types/exchange-rates";

/**
 * Rates are quoted against `rates.base`: 1 base = rates[code] of that currency.
 * Returns null when either leg is missing so callers can degrade instead of
 * showing a made-up number.
 */
export const convert = (
  amount: number,
  fromCode: string,
  toCode: string,
  rates: ExchangeRates | null,
): number | null => {
  if (fromCode === toCode) return amount;
  if (!rates) return null;

  const rateOf = (code: string) =>
    code === rates.base ? 1 : rates.rates[code.toLowerCase()] ?? rates.rates[code];

  const from = rateOf(fromCode);
  const to = rateOf(toCode);

  if (!from || !to) return null;

  return (amount / from) * to;
}

export const sumInCurrency = (
  items: { balance: number; currency_code: string }[],
  targetCode: string,
  rates: ExchangeRates | null,
): number | null => {
  let total = 0;

  for (const item of items) {
    const converted = convert(item.balance, item.currency_code, targetCode, rates);
    if (converted === null) return null;
    total += converted;
  }

  return total;
}
