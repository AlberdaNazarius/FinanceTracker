import React from "react";

import {AlertTriangle, Trash2, Edit2} from "lucide-react";
import {cn, formatMoney} from "@/helpers/utils";
import {BudgetSummary} from "@/types/budget-summary";
import {WARNING_BUDGET_THRESHOLD} from "@/helpers/constants";

type BudgetDetailsCardProps = {
  summary: BudgetSummary;
  currencyCode?: string;
  handleEditBudget: (budgetId: string) => void;
  handleDeleteBudget: (budgetId: string) => void;
}

const BudgetDetailsCard: React.FC<BudgetDetailsCardProps> = (
  {
    summary,
    currencyCode,
    handleEditBudget,
    handleDeleteBudget
  }) => {

  const percentage = summary.usedPercentage;
  const isOverBudget = summary.spent > summary.budget;
  const isWarning = percentage > WARNING_BUDGET_THRESHOLD && !isOverBudget;
  const remaining = summary.remaining;

  return (
    <div
      className="rounded-[var(--radius-lg)] bg-card p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-lg sm:text-xl shrink-0"
            style={{
              backgroundColor: `${summary.categoryColor}20`,
            }}
          >
            {summary.categoryIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
              {summary.category}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isOverBudget
                ? "Over budget"
                : `${formatMoney(remaining, currencyCode)} left`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isOverBudget && (
            <div className="p-1.5 rounded-full bg-danger/10">
              <AlertTriangle className="h-4 w-4 text-danger"/>
            </div>
          )}
          <button
            onClick={() => handleEditBudget(summary.budgetId)}
            className="cursor-pointer p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Edit budget"
          >
            <Edit2 className="h-4 w-4"/>
          </button>
          <button
            onClick={() => handleDeleteBudget(summary.budgetId)}
            className="cursor-pointer p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
            title="Delete budget"
          >
            <Trash2 className="h-4 w-4"/>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Spent</span>
          <span
            className={cn(
              "text-sm font-semibold",
              isOverBudget ? "text-danger" : "text-foreground"
            )}
          >
            {formatMoney(summary.spent, currencyCode)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Budget</span>
          <span className="text-sm font-semibold text-foreground">
            {formatMoney(summary.budget, currencyCode)}
          </span>
        </div>
      </div>

      <div className="mb-2">
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
                  : summary.categoryColor,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-medium",
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
          <span className="text-xs font-semibold text-danger">
            {formatMoney(Math.abs(remaining), currencyCode)} over
          </span>
        )}
      </div>
    </div>
  )
};

export default BudgetDetailsCard;