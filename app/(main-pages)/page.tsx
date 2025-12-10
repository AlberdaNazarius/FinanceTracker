import BalanceCard from "@/components/general/balance-card/BalanceCard";
import AddTransactionBtn from "@/components/general/buttons/add-transaction/AddTransactionBtn";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className='w-full'>
        <BalanceCard title='Total Balance' amount={3243}/>
      </div>
      <div className='flex gap-4'>
        <BalanceCard title='Expenses' amount={32}/>
        <BalanceCard title='Income' amount={43}/>
      </div>
      <AddTransactionBtn/>
    </div>
  );
}

export default Home;