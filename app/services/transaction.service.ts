import axios from "axios";
import {RequestTransaction} from "@/types/request/request_transaction";

// Testing API integration for transactions
const getTransactions = async () => {
  const response = await axios.get("/api/transactions");
  return response.data;
}

const addTransaction = async (transactionData: RequestTransaction) => {
  await axios.post("/api/transactions", transactionData);
}

export const TransactionService = {
  addTransaction,
  getTransactions
}