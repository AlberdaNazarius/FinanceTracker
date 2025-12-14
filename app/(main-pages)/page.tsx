'use client';

import BalanceCard from "@/components/general/balance-card/BalanceCard";
import AddTransactionModal from "./transactions/dialogs/add-transaction-modal/AddTransactionModal";
import useUserStore from "@/store/UserStore";

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
      <AddTransactionModal/>
    </div>
  );
}

export default Home;