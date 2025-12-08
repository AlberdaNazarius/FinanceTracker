import {Category} from "@/types/Category";

export type Budget = {
  amount: bigint;
  category: Category;
  date: Date;
}