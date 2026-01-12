"use client";

import {useState, useCallback} from "react";
import { Plus, Wallet, AlertTriangle, Trash2, Edit2 } from "lucide-react";
import { cn, formatMoney } from "@/helpers/utils";
import useUserStore from "@/store/user-store";
import AddBudgetDialog from "@/components/page/budget/dialogs/add-budget-dialog/add-budget-dialog";
import { BudgetService } from "@/service/client/budget.service";
import {useBudgetSummary} from "@/hooks/use-budget-summary";
import {DANGER_BUDGET_THRESHOLD, WARNING_BUDGET_THRESHOLD} from "@/helpers/constants";
import {Budget} from "@/types/budget";

const BudgetPage = () => {
  const user = useUserStore((state) => state.user);
  const currencyCode = user?.preferredCurrency?.code;
  const { budgetsSummary, loading, refetch } = useBudgetSummary();

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalBudget = budgetsSummary.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgetsSummary.reduce((sum, b) => sum + b.spent, 0);
  const remaining = budgetsSummary.reduce((sum, b) => sum + b.remaining, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsDialogOpen(true);
  };

  const handleEditBudget = async (budgetId: string) => {
    const editingBudget = await BudgetService.getBudgetById(budgetId);

    setIsDialogOpen(true);
    setEditingBudget(editingBudget);
  };

  const handleDeleteBudget = useCallback(
    async (budgetId: string) => {
      if (!confirm("Are you sure you want to delete this budget?")) return;

      try {
        await BudgetService.deleteBudget(budgetId);
        await refetch();
      } catch (error) {
        console.error("Failed to delete budget:", error);
      }
    },
    [refetch]
  );

  const handleDialogSuccess = async () => {
    await refetch();
    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading budgets...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Budget
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your monthly spending limits
          </p>
        </div>
        <AddBudgetDialog
          budget={editingBudget}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleDialogSuccess}
        />
        {!isDialogOpen && (
          <button
            onClick={handleAddBudget}
            className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Budget</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      <div className="rounded-[var(--radius-lg)] bg-card p-4 sm:p-6 shadow-sm border border-border">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Budget Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              Total Budget
            </p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {formatMoney(totalBudget, currencyCode)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              Total Spent
            </p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {formatMoney(totalSpent, currencyCode)}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              Remaining
            </p>
            <p
              className={cn(
                "text-xl sm:text-2xl font-bold",
                remaining >= 0 ? "text-success" : "text-danger"
              )}
            >
              {formatMoney(remaining, currencyCode)}
            </p>
          </div>
        </div>

        {totalBudget > 0 && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Overall Progress
              </span>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                {overallPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-background rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300 rounded-full",
                  overallPercentage > DANGER_BUDGET_THRESHOLD ? "bg-danger" : "bg-primary"
                )}
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
            {overallPercentage > DANGER_BUDGET_THRESHOLD && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-danger">
                <AlertTriangle className="h-3 w-3" />
                <span>You&#39;re close to your budget limit</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {budgetsSummary.map((summary) => {
          const percentage = summary.usedPercentage;
          const isOverBudget = summary.spent > summary.budget;
          const isWarning = percentage > WARNING_BUDGET_THRESHOLD && !isOverBudget;
          const remaining = summary.remaining;

          return (
            <div
              key={summary.budgetId}
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
                      <AlertTriangle className="h-4 w-4 text-danger" />
                    </div>
                  )}
                  <button
                    onClick={() => handleEditBudget(summary.budgetId)}
                    className="cursor-pointer p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit budget"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBudget(summary.budgetId)}
                    className="cursor-pointer p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                    title="Delete budget"
                  >
                    <Trash2 className="h-4 w-4" />
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
          );
        })}
      </div>

      {budgetsSummary.length === 0 && (
        <div className="rounded-[var(--radius-lg)] bg-card p-8 sm:p-12 text-center border border-border">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted/50">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No budgets set
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a budget to track your spending
              </p>
              <button
                onClick={handleAddBudget}
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Your First Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;