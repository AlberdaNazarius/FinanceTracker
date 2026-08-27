"use client";

import React from "react";
import Link from "next/link";
import { Landmark } from "lucide-react";
import { Routes } from "@/enum/routes";
import { LocationBalance } from "@/types/location-balance";
import { formatMoney } from "@/helpers/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  locations: LocationBalance[];
  total: number | null;
  currency: string;
  ratesAvailable: boolean;
  showTotal?: boolean;
  loading?: boolean;
};

const AccountsCard: React.FC<Props> = ({
  locations,
  total,
  currency,
  ratesAvailable,
  showTotal = true,
  loading,
}) => {
  return (
    <div className="rounded-lg bg-card p-4 sm:p-6 shadow-sm border border-border">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <Landmark className="h-4 w-4 text-muted-foreground" />
          Accounts
        </h3>
        <Link
          href={Routes.ACCOUNTS}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Manage
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-9 w-full rounded-md" />
          ))}
        </div>
      ) : locations.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No money locations yet
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {locations.map((location) => (
              <div
                key={location.location_id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
                    style={{ backgroundColor: `${location.color}20` }}
                  >
                    {location.icon}
                  </div>
                  <span className="truncate text-sm font-medium text-foreground">
                    {location.name}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatMoney(location.balance, location.currency_code)}
                </span>
              </div>
            ))}
          </div>

          {showTotal && (
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total
              </span>
              <span className="text-sm font-bold tabular-nums">
                {ratesAvailable && total !== null
                  ? formatMoney(total, currency)
                  : "Rates unavailable"}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AccountsCard;
