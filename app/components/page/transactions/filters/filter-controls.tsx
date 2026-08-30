"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/category";
import { MoneyLocation } from "@/types/money-location";
import { Tag } from "@/types/tag";
import { cn } from "@/helpers/utils";
import { ALL_FILTER, TransactionFilters } from "./types";

type Props = {
  filters: TransactionFilters;
  onChange: (patch: Partial<TransactionFilters>) => void;
  locations: MoneyLocation[];
  categories: Category[];
  tags: Tag[];
  className?: string;
  triggerClassName?: string;
};

const FilterControls = ({
  filters,
  onChange,
  locations,
  categories,
  tags,
  className,
  triggerClassName,
}: Props) => (
  <div className={className}>
    <Select
      value={filters.location}
      onValueChange={(location) => onChange({ location })}
    >
      <SelectTrigger className={cn("cursor-pointer", triggerClassName)}>
        <SelectValue placeholder="All Locations" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value={ALL_FILTER}>
          All Locations
        </SelectItem>
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

    <Select
      value={filters.category}
      onValueChange={(category) => onChange({ category })}
    >
      <SelectTrigger className={cn("cursor-pointer", triggerClassName)}>
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value={ALL_FILTER}>
          All Categories
        </SelectItem>
        {categories
          .filter((category) => !category.parent_id)
          .map((parent) => [
            <SelectItem key={parent.id} value={parent.id} className="cursor-pointer">
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
                  className="cursor-pointer pl-8 text-muted-foreground"
                >
                  {child.name}
                </SelectItem>
              )),
          ])}
      </SelectContent>
    </Select>

    <Select value={filters.tag} onValueChange={(tag) => onChange({ tag })}>
      <SelectTrigger className={cn("cursor-pointer", triggerClassName)}>
        <SelectValue placeholder="All Tags" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value={ALL_FILTER}>
          All Tags
        </SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag.id} value={tag.id} className="cursor-pointer">
            #{tag.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default FilterControls;
