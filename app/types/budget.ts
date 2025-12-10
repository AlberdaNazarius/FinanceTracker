import {Category} from "@/types/category";

export type Budget = {
  id: number;
  amount: number;
  category: Category;
  created_at?: Date;
}