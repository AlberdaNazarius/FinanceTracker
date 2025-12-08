import {TransactionType} from "@/enum/TransactionType";
import {Category} from "@/types/Category";

export type Transaction = {
  type: TransactionType,
  description: string;
  category: Category;
  date: Date;
  amount: bigint;
  currency: string;
}