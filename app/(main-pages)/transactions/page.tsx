'use client';

import TransactionTable from "@/components/page/transactions/transactions-table/transactions-table";
import SearchBar from "@/components/general/search-bar/search-bar";

const Transactions = () => {

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-4">
      <SearchBar value={""} onChange={() => console.log()} />
      <TransactionTable />
    </div>
  )
}

export default Transactions;