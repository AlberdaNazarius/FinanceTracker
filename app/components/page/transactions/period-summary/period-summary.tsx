"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "@/enum/date-range";
import { formatMoney } from "@/helpers/utils";

const RANGE_LABELS: Record<DateRange, string> = {
  [DateRange.WEEK]: "Last 7 days",
  [DateRange.MONTH]: "This month",
  [DateRange.ALL]: "All time",
};

type Props = {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  income: number;
  expense: number;
  currency: string;
  approximate?: boolean;
};

const PeriodSummary = ({
  range,
  onRangeChange,
  income,
  expense,
  currency,
  approximate,
}: Props) => (
  <div className="flex items-center justify-between gap-3">
    <Select value={range} onValueChange={(value) => onRangeChange(value as DateRange)}>
      <SelectTrigger className="cursor-pointer gap-1 border-0 bg-transparent px-0 text-base font-bold text-foreground shadow-none focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start">
        {Object.values(DateRange).map((value) => (
          <SelectItem key={value} value={value} className="cursor-pointer">
            {RANGE_LABELS[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <div className="flex shrink-0 items-center gap-3 text-sm font-semibold tabular-nums">
      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <ArrowUpRight className="h-3.5 w-3.5" />
        {approximate && "~"}
        {formatMoney(income, currency)}
      </span>
      <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
        <ArrowDownLeft className="h-3.5 w-3.5" />
        {approximate && "~"}
        {formatMoney(expense, currency)}
      </span>
    </div>
  </div>
);

export default PeriodSummary;
