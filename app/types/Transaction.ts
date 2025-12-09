import {TransactionType} from "@/enum/TransactionType";
import {Category} from "@/types/Category";

export type Transaction = {
  id: number;
  type: TransactionType,
  description: string;
  category: Category;
  date: Date;
  amount: number;
  currency: string;
}