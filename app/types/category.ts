import {TransactionType} from "@/enum/transaction-type";

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  color: string
  icon: string
}

export type CategoryCreate = Omit<Category, 'id'>;