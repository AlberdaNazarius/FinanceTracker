import {Category} from "@/types/Category";

export type Budget = {
  id: number;
  amount: number;
  category: Category;
  date: Date;
}