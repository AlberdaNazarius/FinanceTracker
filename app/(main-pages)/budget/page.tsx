"use client";

import { useState } from "react";
import { Plus, Wallet, AlertTriangle } from "lucide-react";
import { cn, formatMoney } from "@/helpers/utils";
import useUserStore from "@/store/user-store";

const BudgetPage = () => {
  const user = useUserStore((state) => state.user);
  const currencyCode = user?.preferredCurrency?.code;

  const budgets = [
    {
      id: "1",
      category: { name: "Housing", icon: "🏠", color: "#3b82f6" },
      spent: 1800,
      total: 2000,
    },
    {
      id: "2",
      category: { name: "Food", icon: "🍔", color: "#10b981" },
      spent: 850,
      total: 1000,
    },
    {
      id: "3",
      category: { name: "Transport", icon: "🚗", color: "#f59e0b" },
      spent: 450,
      total: 500,
    },
    {
      id: "4",
      category: { name: "Entertainment", icon: "🎬", color: "#8b5cf6" },
      spent: 380,
      total: 400,
    },
    {
      id: "5",
      category: { name: "Shopping", icon: "🛍️", color: "#ec4899" },
      spent: 620,
      total: 600,
    },
    {
      id: "6",
      category: { name: "Health", icon: "🏥", color: "#ef4444" },
      spent: 200,
      total: 300,
    },
  ];

  const totalBudget = budgets.reduce((sum, b) => sum + b.total, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const overallPercentage = (totalSpent / totalBudget) * 100;

  const handleAddBudget = () => {
    console.log("Add budget clicked");
  };

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
        <button
          onClick={handleAddBudget}
          className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Budget</span>
          <span className="sm:hidden">Add</span>
        </button>
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
                overallPercentage > 90 ? "bg-danger" : "bg-primary"
              )}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
          {overallPercentage > 90 && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-danger">
              <AlertTriangle className="h-3 w-3" />
              <span>You&#39;re close to your budget limit</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.total) * 100;
          const isOverBudget = budget.spent > budget.total;
          const isWarning = percentage > 80 && !isOverBudget;
          const remaining = budget.total - budget.spent;

          return (
            <div
              key={budget.id}
              className="rounded-[var(--radius-lg)] bg-card p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-lg sm:text-xl"
                    style={{
                      backgroundColor: `${budget.category.color}20`,
                    }}
                  >
                    {budget.category.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">
                      {budget.category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isOverBudget
                        ? "Over budget"
                        : `${formatMoney(remaining, currencyCode)} left`}
                    </p>
                  </div>
                </div>
                {isOverBudget && (
                  <div className="p-1.5 rounded-full bg-danger/10">
                    <AlertTriangle className="h-4 w-4 text-danger" />
                  </div>
                )}
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
                    {formatMoney(budget.spent, currencyCode)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Budget</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatMoney(budget.total, currencyCode)}
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
                        : budget.category.color,
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

      {budgets.length === 0 && (
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