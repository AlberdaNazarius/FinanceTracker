import axios from "axios";
import {RequestTransaction} from "@/types/request/request-transaction";
import {ApiRoutes} from "@/enum/api-routes";

const getTransactions = async () => {
  const response = await axios.get(ApiRoutes.TRANSACTIONS);
  return response.data;
}

const addTransaction = async (transactionData: RequestTransaction) => {
  await axios.post(ApiRoutes.TRANSACTIONS, transactionData);
}

const updateTransaction = async (transactionId: string, transactionData: RequestTransaction) => {
  await axios.put(`${ApiRoutes.TRANSACTIONS}/${transactionId}`, transactionData);
}

const deleteTransaction = async (transactionId: string) => {
  await axios.delete(`${ApiRoutes.TRANSACTIONS}/${transactionId}`);
}

export const TransactionService = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
}