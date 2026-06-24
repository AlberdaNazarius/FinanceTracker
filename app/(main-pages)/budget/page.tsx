"use client";

import { useState, useCallback } from "react";
import { Plus, Wallet, AlertTriangle } from "lucide-react";
import {calculateBudgetTotals, cn, formatMoney} from "@/helpers/utils";
import useUserStore from "@/store/user-store";
import AddBudgetDialog from "@/components/page/budget/dialogs/add-budget-dialog/add-budget-dialog";
import { BudgetService } from "@/service/client/budget.service";
import { useBudgetSummary } from "@/hooks/use-budget-summary";
import { DANGER_BUDGET_THRESHOLD } from "@/helpers/constants";
import { Budget } from "@/types/budget";
import BudgetDetailsCard from "@/components/page/budget/budget-details-card/budget-details-card";
import PageHeader from "@/components/common/page-header/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/store/toast-store";
import { confirm } from "@/store/confirm-store";

const BudgetPage = () => {
  const user = useUserStore((state) => state.user);
  const currencyCode = user?.preferredCurrency?.code;
  const {budgetsSummary, loading, refetch} = useBudgetSummary();

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    totalBudget,
    totalSpent,
    totalRemaining,
    overallPercentage,
  } = calculateBudgetTotals(budgetsSummary);

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
      const confirmed = await confirm({
        title: "Delete budget?",
        description: "This budget will be permanently removed.",
        confirmText: "Delete",
        destructive: true,
      });
      if (!confirmed) return;

      try {
        await BudgetService.deleteBudget(budgetId);
        toast.success("Budget deleted");
        await refetch();
      } catch (error) {
        console.error("Failed to delete budget:", error);
        toast.error("Failed to delete budget");
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
      <div className="w-full space-y-4 sm:space-y-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <PageHeader
        title="Budget"
        subtitle="Manage your monthly spending limits"
        action={
          <Button onClick={handleAddBudget} className="cursor-pointer">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Budget</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      />
      <AddBudgetDialog
        budget={editingBudget}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleDialogSuccess}
      />

      <div className="rounded-[var(--radius-lg)] bg-card p-4 sm:p-6 shadow-sm border border-border">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary"/>
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
                totalRemaining >= 0 ? "text-success" : "text-danger"
              )}
            >
              {formatMoney(totalRemaining, currencyCode)}
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
                style={{width: `${Math.min(overallPercentage, 100)}%`}}
              />
            </div>
            {overallPercentage > DANGER_BUDGET_THRESHOLD && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-danger">
                <AlertTriangle className="h-3 w-3"/>
                <span>You&#39;re close to your budget limit</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {budgetsSummary.map((summary) =>
          <BudgetDetailsCard
            key={summary.budgetId}
            summary={summary}
            handleEditBudget={handleEditBudget}
            handleDeleteBudget={handleDeleteBudget}
          />
        )}
      </div>

      {budgetsSummary.length === 0 && (
        <div className="rounded-[var(--radius-lg)] bg-card p-8 sm:p-12 text-center border border-border">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-gray-200">
              <Wallet className="h-8 w-8 text-muted-foreground"/>
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
                <Plus className="h-4 w-4"/>
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