export type DashboardSettings = {
  showBalance: boolean;
  showSpendingChart: boolean;
  showBudgetOverview: boolean;
  showAccounts: boolean;
  /** null means "every location" — a new location shows up without touching settings. */
  accountIds: string[] | null;
}

export const DEFAULT_DASHBOARD_SETTINGS: DashboardSettings = {
  showBalance: true,
  showSpendingChart: true,
  showBudgetOverview: true,
  showAccounts: true,
  accountIds: null,
}
