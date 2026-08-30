"use client";

import { useMemo, useState } from "react";
import useUserStore from "@/store/user-store";
import { useBalance } from "@/hooks/use-balance";
import { useTransactions } from "@/hooks/use-transactions";
import { DEFAULT_DASHBOARD_SETTINGS } from "@/types/dashboard-settings";
import AddTransactionDialog from "@/components/page/home/dialogs/add-transaction-dialog/add-transaction-dialog";
import BalanceCard from "@/components/page/home/balance-card/balance-card";
import SpendingChart from "@/components/page/home/spending-chart/spending-chart";
import BudgetOverview from "@/components/page/home/budget-overview/budget-overview";
import AccountsCard from "@/components/page/home/accounts-card/accounts-card";
import { usePageAction } from "@/hooks/use-page-action";
import { cn } from "@/helpers/utils";

const Home = () => {
  const user = useUserStore((state) => state.user);
  const { balance, loading: balanceLoading, refetch: refetchBalance } = useBalance();
  const { transactions, loading, refetch: refetchTransactions } = useTransactions();

  const settings = user?.dashboardSettings ?? DEFAULT_DASHBOARD_SETTINGS;

  const [addOpen, setAddOpen] = useState(false);

  usePageAction({label: "Add Transaction", onClick: () => setAddOpen(true)});

  const handleTransactionAdded = async () => {
    await Promise.all([refetchBalance(), refetchTransactions()]);
  };

  const visibleLocations = useMemo(() => {
    const active = balance.locations.filter((location) => !location.archived);
    return settings.accountIds
      ? active.filter((location) => settings.accountIds!.includes(location.location_id))
      : active;
  }, [balance.locations, settings.accountIds]);

  const hasSideColumn = settings.showBudgetOverview || settings.showAccounts;

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 w-full">
      <AddTransactionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={handleTransactionAdded}
      />

      {settings.showBalance && (
        <BalanceCard
          title="Total Balance"
          preferredCurrency={balance.currency}
          amount={balance.total}
          ratesAvailable={balance.ratesAvailable}
          locations={balance.locations}
        />
      )}

      {(settings.showSpendingChart || hasSideColumn) && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {settings.showSpendingChart && (
            <div className={cn(hasSideColumn ? "lg:col-span-2" : "lg:col-span-3")}>
              <SpendingChart transactions={transactions} loading={loading} />
            </div>
          )}

          {hasSideColumn && (
            <div
              className={cn(
                "space-y-4 sm:space-y-6",
                settings.showSpendingChart ? "lg:col-span-1" : "lg:col-span-3"
              )}
            >
              {settings.showBudgetOverview && <BudgetOverview />}
              {settings.showAccounts && (
                <AccountsCard
                  locations={visibleLocations}
                  total={balance.total}
                  currency={balance.currency}
                  ratesAvailable={balance.ratesAvailable}
                  showTotal={!settings.accountIds}
                  loading={balanceLoading}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
