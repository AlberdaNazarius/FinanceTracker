import {TransactionType} from "@/enum/transaction-type";

export type TransactionFormValues = {
  type: TransactionType;
  amount: number | string;
  location_id: string | null;
  category_id: string | null;
  description: string;
  transaction_date: string;
}

export type TransferFormValues = {
  from_location_id: string | null;
  to_location_id: string | null;
  from_amount: number | string;
  to_amount: number | string;
  fee_amount: number | string;
  description: string;
  transfer_date: string;
}
