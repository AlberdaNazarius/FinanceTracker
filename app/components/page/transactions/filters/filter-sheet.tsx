"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { MoneyLocation } from "@/types/money-location";
import { Tag } from "@/types/tag";
import { cn } from "@/helpers/utils";
import FilterControls from "./filter-controls";
import { countActiveFilters, TransactionFilters } from "./types";

type Props = {
  filters: TransactionFilters;
  onChange: (patch: Partial<TransactionFilters>) => void;
  onReset: () => void;
  locations: MoneyLocation[];
  categories: Category[];
  tags: Tag[];
  resultCount: number;
  className?: string;
};

const FilterSheet = ({
  filters,
  onChange,
  onReset,
  locations,
  categories,
  tags,
  resultCount,
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={activeCount > 0 ? `Filters (${activeCount} active)` : "Filters"}
          className={cn("relative shrink-0 cursor-pointer", className)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "bottom-0 left-0 top-auto max-h-[85vh] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none rounded-t-2xl border-x-0 border-b-0 p-5 pb-8",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          "sm:bottom-auto sm:left-[50%] sm:top-[50%] sm:max-w-[425px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:border-x sm:border-b sm:pb-5",
          "sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Filters</DialogTitle>
        </DialogHeader>

        <FilterControls
          filters={filters}
          onChange={onChange}
          locations={locations}
          categories={categories}
          tags={tags}
          className="flex flex-col gap-3"
          triggerClassName="w-full"
        />

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onReset}
            disabled={activeCount === 0}
          >
            Reset
          </Button>
          <DialogClose asChild>
            <Button className="flex-2 cursor-pointer">
              Show {resultCount} {resultCount === 1 ? "result" : "results"}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterSheet;
