import {TransactionType} from "@/enum/TransactionType";
import {Category} from "@/types/Category";

export type Transaction = {
  id?: number;
  user_id?: number;
  type: TransactionType,
  category: Category | null;
  amount: number;
  currency: {
    code: string;
    unit_text: string;
  };
  transaction_date: Date;
  description?: string;
  created_at?: Date;
}