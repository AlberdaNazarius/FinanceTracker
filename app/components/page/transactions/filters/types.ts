export const ALL_FILTER = "all";

export type TransactionFilters = {
  location: string;
  category: string;
  tag: string;
};

export const EMPTY_FILTERS: TransactionFilters = {
  location: ALL_FILTER,
  category: ALL_FILTER,
  tag: ALL_FILTER,
};

export const countActiveFilters = (filters: TransactionFilters) =>
  Object.values(filters).filter((value) => value !== ALL_FILTER).length;
