"use client";

import useUserStore from "@/store/user-store";
import { useBalance } from "@/hooks/use-balance";
import { useTransactions } from "@/hooks/use-transactions";
import AddTransactionDialog from "@/components/page/home/dialogs/add-transaction-dialog/add-transaction-dialog";
import BalanceCard from "@/components/page/home/balance-card/balance-card";
import SpendingChart from "@/components/page/home/spending-chart/spending-chart";
import BudgetOverview from "@/components/page/home/budget-overview/budget-overview";
import PageHeader from "@/components/common/page-header/page-header";

const Home = () => {
  const user = useUserStore((state) => state.user);
  const { balance, refetch: refetchBalance } = useBalance();
  const { transactions, loading, refetch: refetchTransactions } =
    useTransactions();

  const handleTransactionAdded = async () => {
    await Promise.all([refetchBalance(), refetchTransactions()]);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 w-full">
      <PageHeader
        title="Dashboard"
        subtitle="Your financial overview"
        action={<AddTransactionDialog onSuccess={handleTransactionAdded} />}
      />

      <BalanceCard
        title="Total Balance"
        preferredCurrency={user?.preferredCurrency?.code}
        amount={balance}
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendingChart transactions={transactions} loading={loading} />
        </div>

        <div>
          <BudgetOverview />
        </div>
      </div>
    </div>
  );
}

export default Home;