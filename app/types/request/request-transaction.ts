import {TransactionType} from "@/enum/transaction-type";

export type RequestTransaction = {
  user_id?: number;
  category_id: string | null;
  location_id: string | null;
  type: TransactionType,
  amount: number;
  transaction_date: Date;
  description?: string;
}