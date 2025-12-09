import {Transaction} from "@/types/Transaction";
import {TRANSACTIONS} from "@/helpers/data";

const addTransaction = async (transactionData: Transaction) => {
  TRANSACTIONS.push(transactionData);
}

export const TransactionService = {
  addTransaction
}