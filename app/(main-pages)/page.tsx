'use client';

import BalanceCard from "@/components/general/balance-card/balance-card";
import useUserStore from "@/store/user-store";
import {useBalance} from "../hooks/use-balance";
import AddTransactionDialog from "@/components/page/home/dialogs/add-transaction-dialog/add-transaction-dialog";

const Home = () => {
  const user = useUserStore(state => state.user);
  const { balance, refetch } = useBalance();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className='w-full'>
        <BalanceCard
          title='Total Balance'
          preferredCurrency={user?.preferred_currency?.code}
          amount={balance}
        />
      </div>
      {/*<div className='flex gap-4'>*/}
      {/*  <BalanceCard title='Expenses' amount={32}/>*/}
      {/*  <BalanceCard title='Income' amount={43}/>*/}
      {/*</div>*/}
      <AddTransactionDialog onSuccess={refetch}/>
    </div>
  );
}

export default Home;