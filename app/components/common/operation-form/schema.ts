import * as yup from 'yup';
import {TransactionType} from "@/enum/transaction-type";

export const transactionSchema = yup.object({
  type: yup
    .mixed<TransactionType>()
    .oneOf(Object.values(TransactionType))
    .required("Transaction type is required"),
  description: yup.string().optional(),
  location_id: yup.string().nullable().required("Location is required"),
  category_id: yup.string().nullable().required("Category is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(0.01, "Must be at least 0.01"),
  transaction_date: yup
    .date()
    .typeError("Invalid date")
    .required("Transaction date is required"),
});

export const transferSchema = yup.object({
  from_location_id: yup.string().nullable().required("Source is required"),
  to_location_id: yup
    .string()
    .nullable()
    .required("Destination is required")
    .test(
      "different-locations",
      "Must differ from the source",
      function (value) {
        return value !== this.parent.from_location_id;
      }
    ),
  from_amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(0.01, "Must be at least 0.01"),
  to_amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Received amount is required")
    .min(0.01, "Must be at least 0.01"),
  fee_amount: yup
    .number()
    .typeError("Fee must be a number")
    .min(0, "Fee cannot be negative"),
  description: yup.string().optional(),
  transfer_date: yup
    .date()
    .typeError("Invalid date")
    .required("Date is required"),
});
