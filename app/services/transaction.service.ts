import {Transaction} from "@/types/Transaction";
import axios from "axios";

const addTransaction = async (transactionData: Transaction) => {
  await axios.post("/api/transactions", {
    ...transactionData,
    category: transactionData?.category?.name,
  });
}

export const TransactionService = {
  addTransaction
}