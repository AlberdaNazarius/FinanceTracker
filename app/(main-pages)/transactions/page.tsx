"use client";

import TransactionTable from "@/components/page/transactions/transactions-table/transactions-table";
import SearchBar from "@/components/general/search-bar/search-bar";
import {useEffect, useMemo, useState} from "react";
import {useDebounce} from "@/hooks/use-debounce";
import {useTransactions} from "@/hooks/use-transactions";
import {TransactionType} from "@/enum/transaction-type";
import {Category} from "@/types/category";
import {CategoryService} from "@/service/client/category.service";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {cn, getDateRange} from "@/helpers/utils";
import {DateRange} from "@/enum/date-range";
import PageHeader from "@/components/common/page-header/page-header";
import AddTransactionDialog from "@/components/page/home/dialogs/add-transaction-dialog/add-transaction-dialog";

const Transactions = () => {
  const { transactions, refetch } = useTransactions();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<TransactionType | "all">(
    "all"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(DateRange.MONTH);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category?.id === selectedCategory);
    }

    const dateFrom = getDateRange(selectedDateRange);
    if (dateFrom) {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate >= dateFrom;
      });
    }

    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((t) => {
        const descriptionMatch =
          t.description?.toLowerCase().includes(searchLower) ?? false;
        const categoryMatch =
          t.category?.name?.toLowerCase().includes(searchLower) ?? false;
        return descriptionMatch || categoryMatch;
      });
    }

    return filtered;
  }, [
    transactions,
    selectedType,
    selectedCategory,
    selectedDateRange,
    debouncedSearch,
  ]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Transactions"
        subtitle="Browse and manage your activity"
        action={<AddTransactionDialog onSuccess={refetch} />}
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-3 sm:gap-4">
        {/* Transaction Type Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedType("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
              selectedType === "all"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType(TransactionType.INCOME)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
              selectedType === TransactionType.INCOME
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
            )}
          >
            Income
          </button>
          <button
            onClick={() => setSelectedType(TransactionType.EXPENSE)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
              selectedType === TransactionType.EXPENSE
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
            )}
          >
            Expenses
          </button>
        </div>

        {/* Category and Date Range Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="cursor-pointer w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='cursor-pointer' value="all">All Categories</SelectItem>
              {!loadingCategories &&
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className='cursor-pointer'>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Select
            value={selectedDateRange}
            onValueChange={(value) => setSelectedDateRange(value as DateRange)}
          >
            <SelectTrigger className="cursor-pointer w-full sm:w-40">
              <SelectValue placeholder="This month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='cursor-pointer' value={DateRange.WEEK}>Last 7 days</SelectItem>
              <SelectItem className='cursor-pointer' value={DateRange.MONTH}>This month</SelectItem>
              <SelectItem className='cursor-pointer' value={DateRange.ALL}>All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SearchBar value={search} onChange={handleSearchChange} />

      <TransactionTable transactions={filteredTransactions} refetch={refetch} />
    </div>
  );
};

export default Transactions;
