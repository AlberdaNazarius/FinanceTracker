'use client';

import BalanceCard from "@/components/general/balance-card/balance-card";
import AddTransactionDialog from "./transactions/dialogs/add-transaction-dialog/add-transaction-dialog";
import useUserStore from "@/store/user-store";

const Home = () => {
  const user = useUserStore(state => state.user);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className='w-full'>
        <BalanceCard title='Total Balance' amount={user?.balance ?? 0}/>
      </div>
      {/*<div className='flex gap-4'>*/}
      {/*  <BalanceCard title='Expenses' amount={32}/>*/}
      {/*  <BalanceCard title='Income' amount={43}/>*/}
      {/*</div>*/}
      <AddTransactionDialog/>
    </div>
  );
}

export default Home;