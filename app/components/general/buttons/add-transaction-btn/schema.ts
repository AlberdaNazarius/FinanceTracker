import * as yup from 'yup';
import {TransactionType} from "@/enum/transaction-type";

export const transactionSchema = yup.object({
  type: yup
    .mixed<TransactionType>()
    .oneOf(Object.values(TransactionType))
    .required("Transaction type is required"),
  description: yup.string().optional(),
  category_id: yup.string().required("Category is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(0.01, "Must be at least 0.01"),

  currency_id: yup.string().required("Currency is required"),
  transaction_date: yup
    .date()
    .typeError("Invalid date")
    .required("Transaction date is required"),
});