"use client";

import { X } from "lucide-react";
import { Category } from "@/types/category";
import { MoneyLocation } from "@/types/money-location";
import { Tag } from "@/types/tag";
import { cn } from "@/helpers/utils";
import { ALL_FILTER, TransactionFilters } from "./types";

type Props = {
  filters: TransactionFilters;
  onChange: (patch: Partial<TransactionFilters>) => void;
  onReset: () => void;
  locations: MoneyLocation[];
  categories: Category[];
  tags: Tag[];
  className?: string;
};

const ActiveFilterChips = ({
  filters,
  onChange,
  onReset,
  locations,
  categories,
  tags,
  className,
}: Props) => {
  const location = locations.find((item) => item.id === filters.location);
  const category = categories.find((item) => item.id === filters.category);
  const tag = tags.find((item) => item.id === filters.tag);

  const chips = [
    location && {
      key: "location",
      label: `${location.icon ?? ""} ${location.name}`.trim(),
      clear: () => onChange({ location: ALL_FILTER }),
    },
    category && {
      key: "category",
      label: `${category.icon ?? ""} ${category.name}`.trim(),
      clear: () => onChange({ category: ALL_FILTER }),
    },
    tag && {
      key: "tag",
      label: `#${tag.name}`,
      clear: () => onChange({ tag: ALL_FILTER }),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  if (chips.length === 0) return null;

  return (
    <div
      className={cn(
        "-mx-2 flex items-center gap-2 overflow-x-auto px-2 no-scrollbar",
        className
      )}
    >
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.clear}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/70"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}

      {chips.length > 1 && (
        <button
          onClick={onReset}
          className="shrink-0 cursor-pointer px-1 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilterChips;
