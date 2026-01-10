"use client";

import TransactionTable from "@/components/page/transactions/transactions-table/transactions-table";
import SearchBar from "@/components/general/search-bar/search-bar";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useTransactions } from "@/hooks/use-transactions";

const Transactions = () => {
  const { transactions, refetch } = useTransactions();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const filteredTransactions = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return transactions;
    }

    const searchLower = debouncedSearch.toLowerCase();
    return transactions.filter((t) => {
      const descriptionMatch =
        t.description?.toLowerCase().includes(searchLower) ?? false;
      const categoryMatch =
        t.category?.name?.toLowerCase().includes(searchLower) ?? false;
      return descriptionMatch || categoryMatch;
    });
  }, [transactions, debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-4">
      <SearchBar value={search} onChange={handleSearchChange} />
      <TransactionTable transactions={filteredTransactions} refetch={refetch} />
    </div>
  );
};

export default Transactions;
