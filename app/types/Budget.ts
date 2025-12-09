import {Category} from "@/types/Category";

export type Budget = {
  id: number;
  amount: number;
  category: Category;
  created_at?: Date;
}