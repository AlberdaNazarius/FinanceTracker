import {TransactionType} from "@/enum/transaction-type";
import {Category} from "@/types/category";
import {Currency} from "@/types/currency";
import {MoneyLocation} from "@/types/money-location";
import {Tag} from "@/types/tag";

export type ResponseTransaction = {
  id: string;
  user_id?: string;
  type: TransactionType,
  category: Category;
  location: MoneyLocation;
  tags: Tag[];
  amount: number;
  currency: Currency
  transaction_date: Date;
  description?: string;
  created_at: Date;
}