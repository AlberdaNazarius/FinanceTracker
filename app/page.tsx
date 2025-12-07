import BalanceCard from "@/components/general/balance-card/BalanceCard";
import AddTransactionBtn from "@/components/buttons/add-transaction/AddTransactionBtn";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      <BalanceCard/>
      <AddTransactionBtn/>
    </div>
  );
}

export default Home;