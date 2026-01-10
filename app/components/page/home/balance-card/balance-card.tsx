"use client";

import React from "react";
import { cn, formatMoney } from "@/helpers/utils";
import { Wallet, TrendingUp } from "lucide-react";

type BalanceCardProps = {
  amount: number;
  title: string;
  preferredCurrency?: string;
  numberColor?: string;
};

const BalanceCard: React.FC<BalanceCardProps> = ({
  amount,
  title,
  preferredCurrency,
  numberColor,
}) => {
  const isPositive = amount >= 0;

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-primary/95 via-primary/85 to-primary/75 p-6 sm:p-8 shadow-lg border border-primary/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-foreground/80">
                {title}
              </p>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
            <TrendingUp className="h-4 w-4 text-primary-foreground/80" />
          </div>
        </div>

        <div className="space-y-2">
          <h2
            className={cn(
              "text-4xl sm:text-5xl font-bold text-primary-foreground leading-tight",
              numberColor && `text-[${numberColor}]`
            )}
          >
            {formatMoney(amount, preferredCurrency)}
          </h2>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-semibold",
                isPositive
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-danger/20 text-danger border border-danger/30"
              )}
            >
              {isPositive ? "Positive" : "Negative"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
