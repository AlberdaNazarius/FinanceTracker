'use client';

import {formatDate, formatMoney} from "@/helpers/utils";
import {TransactionService} from "@/service/transaction.service";
import {useEffect, useState} from "react";
import {ResponseTransaction} from "@/types/response/response_transaction";

const Transactions = () => {
  const [userTransactions, setUserTransactions] = useState<ResponseTransaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await TransactionService.getTransactions();
        console.log("Fetched transactions:", response);
        setUserTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className='border-1 rounded-2xl w-full self-start'>
      <table className="w-full table-fixed sm:table-auto">
        <thead
          className="hidden sm:table-header-group bg-card/50 border-b border-border text-sm font-semibold text-muted-foreground"
        >
          <tr>
            <th className="py-4 px-6 text-left">Transaction</th>
            <th className="py-4 px-6 text-left">Category</th>
            <th className="py-4 px-6 text-left">Date</th>
            <th className="py-4 px-6 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className='bg-card'>
          {userTransactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-accent/50">
              <td className="py-4 px-6 text-left">{transaction?.description ?? 'N/A'}</td>
              <td className="py-4 px-6 text-left">{transaction?.category?.name ?? 'N/A'}</td>
              <td className="py-4 px-6 text-left">{formatDate(transaction?.transaction_date)}</td>
              <td className="py-4 px-6 text-right">{formatMoney(transaction?.amount, transaction?.currency?.code)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Transactions;