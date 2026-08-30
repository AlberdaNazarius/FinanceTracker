"use client";

import TransactionTable from "@/components/page/transactions/transactions-table/transactions-table";
import SearchBar from "@/components/general/search-bar/search-bar";
import {useEffect, useMemo, useState} from "react";
import {useDebounce} from "@/hooks/use-debounce";
import {useTransactionFeed} from "@/hooks/use-transaction-feed";
import {useMoneyLocations} from "@/hooks/use-money-locations";
import {useTags} from "@/hooks/use-tags";
import {TransactionType} from "@/enum/transaction-type";
import {OperationKind} from "@/enum/operation-kind";
import {Operation} from "@/types/operation";
import {Category} from "@/types/category";
import {CategoryService} from "@/service/client/category.service";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {cn, getDateRange} from "@/helpers/utils";
import {DateRange} from "@/enum/date-range";
import PageHeader from "@/components/common/page-header/page-header";
import AddTransactionDialog from "@/components/page/home/dialogs/add-transaction-dialog/add-transaction-dialog";

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

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<TypeFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
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
      if (selectedCategory === "all") return true;
      if (operation.kind !== OperationKind.TRANSACTION) return false;

      const category = operation.transaction.category;
      return category?.id === selectedCategory || category?.parent_id === selectedCategory;
    };

    const matchesTag = (operation: Operation) =>
      selectedTag === "all" ||
      (operation.kind === OperationKind.TRANSACTION &&
        (operation.transaction.tags ?? []).some((tag) => tag.id === selectedTag));

    const matchesLocation = (operation: Operation) => {
      if (selectedLocation === "all") return true;
      return operation.kind === OperationKind.TRANSACTION
        ? operation.transaction.location?.id === selectedLocation
        : operation.transfer.from_location?.id === selectedLocation ||
            operation.transfer.to_location?.id === selectedLocation;
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
  }, [
    operations,
    selectedType,
    selectedCategory,
    selectedTag,
    selectedLocation,
    selectedDateRange,
    debouncedSearch,
  ]);

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Transactions"
        subtitle="Browse and manage your activity"
        action={<AddTransactionDialog onSuccess={refetch} />}
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedType(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
                selectedType === filter.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Location Filter */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="cursor-pointer w-full sm:w-[180px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span>{location.icon}</span>
                    <span>{location.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="cursor-pointer w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='cursor-pointer' value="all">All Categories</SelectItem>
              {!loadingCategories &&
                categories
                  .filter((category) => !category.parent_id)
                  .map((parent) => [
                    <SelectItem key={parent.id} value={parent.id} className='cursor-pointer'>
                      <div className="flex items-center gap-2">
                        <span>{parent.icon}</span>
                        <span>{parent.name}</span>
                      </div>
                    </SelectItem>,
                    ...categories
                      .filter((child) => child.parent_id === parent.id)
                      .map((child) => (
                        <SelectItem
                          key={child.id}
                          value={child.id}
                          className='cursor-pointer pl-8 text-muted-foreground'
                        >
                          {child.name}
                        </SelectItem>
                      )),
                  ])}
            </SelectContent>
          </Select>

          {/* Tag Filter */}
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="cursor-pointer w-full sm:w-[160px]">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id} className="cursor-pointer">
                  #{tag.name}
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

      <SearchBar value={search} onChange={setSearch} />

      <TransactionTable operations={filteredOperations} refetch={refetch} />
    </div>
  );
};

export default Transactions;
