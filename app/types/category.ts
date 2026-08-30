import {TransactionType} from "@/enum/transaction-type";

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  color: string
  icon: string
  parent_id: string | null
}

export type CategoryCreate = Omit<Category, 'id'>;