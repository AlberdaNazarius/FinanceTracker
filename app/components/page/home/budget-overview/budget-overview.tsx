"use client";

import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { useBudgetSummary } from "@/hooks/use-budget-summary";
import {formatMoney, cn, calculateBudgetTotals} from "@/helpers/utils";
import useUserStore from "@/store/user-store";
import { WARNING_BUDGET_THRESHOLD, DANGER_BUDGET_THRESHOLD } from "@/helpers/constants";
import { Skeleton } from "@/components/ui/skeleton";

const BudgetOverview = () => {
  const user = useUserStore((state) => state.user);
  const currencyCode = user?.preferredCurrency?.code;
  const { budgetsSummary, ratesAvailable, loading } = useBudgetSummary();

  const topBudgets = useMemo(() => {
    return [...budgetsSummary]
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 4);
  }, [budgetsSummary]);

  const {
    totalBudget,
    totalSpent,
    totalRemaining,
    overallPercentage,
    isOverBudget
  } = calculateBudgetTotals(budgetsSummary);

  //const isWarning = overallPercentage > WARNING_BUDGET_THRESHOLD && !isOverBudget;
  const isDanger = overallPercentage > DANGER_BUDGET_THRESHOLD && !isOverBudget;

  if (loading) {
    return (
      <div className="rounded-lg bg-card p-4 sm:p-6 shadow-sm border border-border">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
          Budget Overview
        </h3>
        <div className="space-y-4 sm:space-y-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (budgetsSummary.length === 0) {
    return (
      <div className="rounded-lg bg-card p-4 sm:p-6 shadow-sm border border-border">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
          Budget Overview
        </h3>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-muted-foreground">
            No budgets set yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Create a budget to track your spending
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card p-4 sm:p-6 shadow-sm border border-border">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
        Budget Overview
      </h3>

      {!ratesAvailable && (
        <p className="-mt-3 mb-4 text-xs text-danger">
          Spending in currencies with no exchange rate is not counted.
        </p>
      )}

      <div className="space-y-4 sm:space-y-5">
        {topBudgets.map((budget) => {
          const percentage = budget.usedPercentage;
          const isOverBudget = budget.spent > budget.budget;
          const isWarning = percentage > WARNING_BUDGET_THRESHOLD && !isOverBudget;

          return (
            <div key={budget.budgetId}>
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs sm:text-sm shrink-0"
                  style={{
                    backgroundColor: `${budget.categoryColor}20`,
                  }}
                >
                  {budget.categoryIcon}
                </div>
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {budget.category}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] sm:text-xs font-medium ml-2 shrink-0",
                      isOverBudget ? "text-danger" : "text-muted-foreground"
                    )}
                  >
                    {formatMoney(budget.spent, currencyCode)} /{" "}
                    {formatMoney(budget.budget, currencyCode)}
                  </span>
                </div>
              </div>

              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300 rounded-full",
                    isOverBudget && "bg-danger"
                  )}
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: isOverBudget
                      ? undefined
                      : isWarning
                      ? "#f59e0b"
                      : budget.categoryColor,
                  }}
                />
              </div>

              <div className="flex items-center gap-1 mt-1">
                <span
                  className={cn(
                    "text-[10px] sm:text-xs",
                    isOverBudget
                      ? "text-danger"
                      : isWarning
                      ? "text-[#f59e0b]"
                      : "text-muted-foreground"
                  )}
                >
                  {percentage.toFixed(0)}% used
                </span>
                {isOverBudget && (
                  <AlertTriangle className="h-3 w-3 text-danger shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Total Budget
          </span>
          <span className="text-base sm:text-lg font-semibold text-foreground">
            {formatMoney(totalBudget, currencyCode)}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Total Spent
          </span>
          <span
            className={cn(
              "text-base sm:text-lg font-semibold",
              isOverBudget ? "text-danger" : "text-foreground"
            )}
          >
            {formatMoney(totalSpent, currencyCode)}
          </span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Remaining
          </span>
          <span
            className={cn(
              "text-base sm:text-lg font-semibold",
              totalRemaining >= 0 ? "text-success" : "text-danger"
            )}
          >
            {formatMoney(totalRemaining, currencyCode)}
          </span>
        </div>
        {totalBudget > 0 && (
          <div
            className={cn(
              "mt-3 p-2.5 sm:p-3 rounded-lg",
              isOverBudget
                ? "bg-danger/10"
                : isDanger
                ? "bg-[#f59e0b]/10"
                : "bg-success/10"
            )}
          >
            <p
              className={cn(
                "text-[10px] sm:text-xs font-medium flex items-center gap-1",
                isOverBudget
                  ? "text-danger"
                  : isDanger
                  ? "text-[#f59e0b]"
                  : "text-success"
              )}
            >
              {isOverBudget ? (
                <>
                  <AlertTriangle className="h-3 w-3" />
                  You&apos;re over budget this month!
                </>
              ) : isDanger ? (
                <>
                  <AlertTriangle className="h-3 w-3" />
                  You&apos;re close to your budget limit
                </>
              ) : (
                <>You&apos;re within budget this month! 🎉</>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetOverview;