import {TransactionType} from "@/enum/transaction-type";
import {Category} from "@/types/category";
import {Currency} from "@/types/currency";

export type ResponseTransaction = {
  id?: number;
  user_id?: number;
  type: TransactionType,
  category: Category;
  amount: number;
  currency: Currency
  transaction_date: Date;
  description?: string;
  created_at: Date;
}