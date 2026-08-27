"use client";

import React from "react";
import { formatMoney } from "@/helpers/utils";
import { Wallet } from "lucide-react";
import { LocationBalance } from "@/types/location-balance";

type BalanceCardProps = {
  amount: number | null;
  title: string;
  preferredCurrency?: string;
  ratesAvailable?: boolean;
  locations?: LocationBalance[];
};

/** Falls back to per-currency subtotals rather than inventing a converted number. */
const nativeTotals = (locations: LocationBalance[]) => {
  const totals = new Map<string, number>();

  for (const location of locations) {
    totals.set(
      location.currency_code,
      (totals.get(location.currency_code) ?? 0) + location.balance
    );
  }

  return [...totals.entries()];
};

const BalanceCard: React.FC<BalanceCardProps> = ({
  amount,
  title,
  preferredCurrency,
  ratesAvailable = true,
  locations = [],
}) => {
  const degraded = !ratesAvailable || amount === null;
  const totals = degraded ? nativeTotals(locations.filter((l) => !l.archived)) : [];

  return (
    <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-primary/95 via-primary/85 to-primary/75 p-6 sm:p-8 shadow-lg border border-primary/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-sm font-medium text-primary-foreground/80">
            {title}
          </p>
        </div>

        {degraded ? (
          <>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              {totals.length > 0 ? (
                totals.map(([code, total]) => (
                  <h2
                    key={code}
                    className="text-2xl sm:text-3xl font-bold text-primary-foreground leading-tight"
                  >
                    {formatMoney(total, code)}
                  </h2>
                ))
              ) : (
                <h2 className="text-4xl sm:text-5xl font-bold text-primary-foreground leading-tight">
                  {formatMoney(0, preferredCurrency)}
                </h2>
              )}
            </div>
            <p className="mt-3 text-xs text-primary-foreground/70">
              Rates unavailable — showing each currency separately.
            </p>
          </>
        ) : (
          <h2 className="text-4xl sm:text-5xl font-bold text-primary-foreground leading-tight">
            {formatMoney(amount, preferredCurrency)}
          </h2>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;
