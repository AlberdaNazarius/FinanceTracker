import {Transaction} from "@/types/Transaction";
import axios from "axios";

// Testing API integration for transactions
const getTransactions = async () => {
  const response = await axios.get("/api/transactions");
  return response.data;
}

const addTransaction = async (transactionData: Transaction) => {
  await axios.post("/api/transactions", {
    ...transactionData,
    category: transactionData?.category?.name,
  });
}

export const TransactionService = {
  addTransaction,
  getTransactions
}