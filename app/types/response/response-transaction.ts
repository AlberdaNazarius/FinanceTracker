import {TransactionType} from "@/enum/transaction-type";
import {Category} from "@/types/category";
import {Currency} from "@/types/currency";
import {MoneyLocation} from "@/types/money-location";

export type ResponseTransaction = {
  id: string;
  user_id?: string;
  type: TransactionType,
  category: Category;
  location: MoneyLocation;
  amount: number;
  currency: Currency
  transaction_date: Date;
  description?: string;
  created_at: Date;
}