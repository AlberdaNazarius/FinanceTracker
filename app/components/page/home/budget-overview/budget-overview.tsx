const BudgetOverview = () => {
  const budgets = [
    { category: "Housing", spent: 1800, total: 2000, color: "bg-primary" },
    { category: "Food", spent: 850, total: 1000, color: "bg-success" },
    { category: "Transport", spent: 450, total: 500, color: "bg-secondary" },
    { category: "Entertainment", spent: 380, total: 400, color: "bg-accent" },
  ]

  return (
    <div className="rounded-[var(--radius-lg)] bg-card p-4 sm:p-6 shadow-sm border border-border">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Budget Overview</h3>

      <div className="space-y-5 sm:space-y-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.total) * 100
          const isOverBudget = percentage > 90

          return (
            <div key={budget.category}>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-medium text-foreground">{budget.category}</span>
                <span className={`text-[10px] sm:text-xs font-medium ${isOverBudget ? "text-danger" : "text-muted"}`}>
                  ${budget.spent} / ${budget.total}
                </span>
              </div>

              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full ${budget.color} transition-all duration-300 rounded-full ${
                    isOverBudget ? "bg-danger" : ""
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center gap-1 mt-1">
                <span className={`text-[10px] sm:text-xs ${isOverBudget ? "text-danger" : "text-muted"}`}>
                  {percentage.toFixed(0)}% used
                </span>
                {isOverBudget && (
                  <svg className="h-3 w-3 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-muted">Total Budget</span>
          <span className="text-base sm:text-lg font-semibold text-foreground">$3,900</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-muted">Total Spent</span>
          <span className="text-base sm:text-lg font-semibold text-foreground">$3,480</span>
        </div>
        <div className="mt-3 p-2.5 sm:p-3 rounded-lg bg-success/10">
          <p className="text-[10px] sm:text-xs text-success font-medium">You&#39;re within budget this month! 🎉</p>
        </div>
      </div>
    </div>
  )
}

export default BudgetOverview;