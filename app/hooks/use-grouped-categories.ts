import { useEffect, useState } from "react";
import { CategoryService } from "@/service/client/category.service";
import { Category } from "@/types/category";
import { TransactionType } from "@/enum/transaction-type";

export type GroupedCategories = {
  [key in TransactionType]?: Category[];
}

export const childrenOf = (categories: Category[] | undefined, parentId: string) =>
  (categories ?? []).filter((category) => category.parent_id === parentId);

/** Fetches categories grouped by type, but only once `enabled` flips on. */
export function useGroupedCategories(enabled: boolean) {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategories>({});

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    const load = async () => {
      try {
        const response = await CategoryService.getCategories();
        if (!mounted || !response.data) return;

        setGroupedCategories(
          response.data.reduce<GroupedCategories>((acc, category) => {
            (acc[category.type] ??= []).push(category);
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [enabled]);

  return groupedCategories;
}
