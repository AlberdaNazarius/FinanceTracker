import {TransactionType} from "@/enum/TransactionType";

export type RequestTransaction = {
  user_id?: number;
  category_id: string | null;
  currency_id: number;
  type: TransactionType,
  amount: number;
  transaction_date: Date;
  description?: string;
}