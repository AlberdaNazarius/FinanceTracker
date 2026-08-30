"use client";

import TransactionTable from "@/components/page/transactions/transactions-table/transactions-table";
import SearchBar from "@/components/general/search-bar/search-bar";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Plus} from "lucide-react";
import {useDebounce} from "@/hooks/use-debounce";
import {useTransactionFeed} from "@/hooks/use-transaction-feed";
import {useMoneyLocations} from "@/hooks/use-money-locations";
import {useTags} from "@/hooks/use-tags";
import {useExchangeRates} from "@/hooks/use-exchange-rates";
import useUserStore from "@/store/user-store";
import {TransactionType} from "@/enum/transaction-type";
import {OperationKind} from "@/enum/operation-kind";
import {Operation} from "@/types/operation";
import {Category} from "@/types/category";
import {CategoryService} from "@/service/client/category.service";
import {Button} from "@/components/ui/button";
import {cn, getDateRange} from "@/helpers/utils";
import {convert} from "@/helpers/exchange";
import {DEFAULT_CURRENCY} from "@/helpers/constants";
import {DateRange} from "@/enum/date-range";
import PageHeader from "@/components/common/page-header/page-header";
import AddTransactionDialog from "@/components/page/home/dialogs/add-transaction-dialog/add-transaction-dialog";
import PeriodSummary from "@/components/page/transactions/period-summary/period-summary";
import FilterControls from "@/components/page/transactions/filters/filter-controls";
import FilterSheet from "@/components/page/transactions/filters/filter-sheet";
import ActiveFilterChips from "@/components/page/transactions/filters/active-filter-chips";
import {
  ALL_FILTER,
  EMPTY_FILTERS,
  TransactionFilters,
} from "@/components/page/transactions/filters/types";

type TypeFilter = TransactionType | OperationKind.TRANSFER | "all";

const TYPE_FILTERS: {value: TypeFilter; label: string}[] = [
  {value: "all", label: "All"},
  {value: TransactionType.INCOME, label: "Income"},
  {value: TransactionType.EXPENSE, label: "Expenses"},
  {value: OperationKind.TRANSFER, label: "Transfers"},
];

const Transactions = () => {
  const {operations, refetch} = useTransactionFeed();
  const {locations} = useMoneyLocations();
  const {tags} = useTags();

  const user = useUserStore((state) => state.user);
  const currencyCode = user?.preferredCurrency?.code ?? DEFAULT_CURRENCY.code;
  const {rates} = useExchangeRates(currencyCode);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<TypeFilter>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(DateRange.MONTH);
  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);
  const [categories, setCategories] = useState<Category[]>([]);

  const debouncedSearch = useDebounce(search);

  const updateFilters = useCallback(
    (patch: Partial<TransactionFilters>) =>
      setFilters((current) => ({...current, ...patch})),
    []
  );

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const filteredOperations = useMemo(() => {
    const matchesType = (operation: Operation) => {
      if (selectedType === "all") return true;
      if (selectedType === OperationKind.TRANSFER) {
        return operation.kind === OperationKind.TRANSFER;
      }
      return (
        operation.kind === OperationKind.TRANSACTION &&
        operation.transaction.type === selectedType
      );
    };

    const matchesCategory = (operation: Operation) => {
      if (filters.category === ALL_FILTER) return true;
      if (operation.kind !== OperationKind.TRANSACTION) return false;

      const category = operation.transaction.category;
      return category?.id === filters.category || category?.parent_id === filters.category;
    };

    const matchesTag = (operation: Operation) =>
      filters.tag === ALL_FILTER ||
      (operation.kind === OperationKind.TRANSACTION &&
        (operation.transaction.tags ?? []).some((tag) => tag.id === filters.tag));

    const matchesLocation = (operation: Operation) => {
      if (filters.location === ALL_FILTER) return true;
      return operation.kind === OperationKind.TRANSACTION
        ? operation.transaction.location?.id === filters.location
        : operation.transfer.from_location?.id === filters.location ||
            operation.transfer.to_location?.id === filters.location;
    };

    const dateFrom = getDateRange(selectedDateRange);
    const matchesDate = (operation: Operation) =>
      !dateFrom || new Date(operation.date) >= dateFrom;

    const searchLower = debouncedSearch.trim().toLowerCase();
    const matchesSearch = (operation: Operation) => {
      if (!searchLower) return true;

      const haystack =
        operation.kind === OperationKind.TRANSACTION
          ? [
              operation.transaction.description,
              operation.transaction.category?.name,
              operation.transaction.location?.name,
              ...(operation.transaction.tags ?? []).map((tag) => tag.name),
            ]
          : [
              operation.transfer.description,
              operation.transfer.from_location?.name,
              operation.transfer.to_location?.name,
            ];

      return haystack.some((value) => value?.toLowerCase().includes(searchLower));
    };

    return operations.filter(
      (operation) =>
        matchesType(operation) &&
        matchesCategory(operation) &&
        matchesTag(operation) &&
        matchesLocation(operation) &&
        matchesDate(operation) &&
        matchesSearch(operation)
    );
  }, [operations, selectedType, filters, selectedDateRange, debouncedSearch]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    let approximate = false;

    for (const operation of filteredOperations) {
      if (operation.kind !== OperationKind.TRANSACTION) continue;

      const {transaction} = operation;
      const amount = convert(
        transaction.amount ?? 0,
        transaction.currency?.code ?? currencyCode,
        currencyCode,
        rates
      );

      if (amount === null) {
        approximate = true;
        continue;
      }

      if (transaction.type === TransactionType.INCOME) {
        income += amount;
      } else {
        expense += amount;
      }
    }

    return {income, expense, approximate};
  }, [filteredOperations, currencyCode, rates]);

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-5">
      <div className="hidden md:block">
        <PageHeader
          title="Transactions"
          subtitle="Browse and manage your activity"
          action={<AddTransactionDialog onSuccess={refetch} />}
        />
      </div>

      <PeriodSummary
        range={selectedDateRange}
        onRangeChange={setSelectedDateRange}
        income={totals.income}
        expense={totals.expense}
        currency={currencyCode}
        approximate={totals.approximate}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div className="-mx-2 flex items-center gap-2 overflow-x-auto px-2 no-scrollbar">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedType(filter.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                selectedType === filter.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <FilterControls
          filters={filters}
          onChange={updateFilters}
          locations={locations}
          categories={categories}
          tags={tags}
          className="hidden md:flex md:gap-4"
          triggerClassName="w-[180px]"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <FilterSheet
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          locations={locations}
          categories={categories}
          tags={tags}
          resultCount={filteredOperations.length}
          className="md:hidden"
        />
      </div>

      <ActiveFilterChips
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilters}
        locations={locations}
        categories={categories}
        tags={tags}
        className="md:hidden"
      />

      <TransactionTable operations={filteredOperations} refetch={refetch} />

      <AddTransactionDialog
        onSuccess={refetch}
        trigger={
          <Button
            size="icon"
            aria-label="Add transaction"
            className="fixed bottom-20 right-4 z-40 size-14 rounded-full shadow-lg cursor-pointer md:hidden"
          >
            <Plus className="size-6" />
          </Button>
        }
      />
    </div>
  );
};

export default Transactions;
