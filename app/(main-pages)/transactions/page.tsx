'use client';

import {cn, formatDate, formatMoney} from "@/helpers/utils";
import {TransactionService} from "@/service/client/transaction.service";
import {useEffect, useState} from "react";
import {ResponseTransaction} from "@/types/response/response-transaction";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {TransactionType} from "@/enum/transaction-type";

const Transactions = () => {
  const [userTransactions, setUserTransactions] = useState<ResponseTransaction[]>([]);

  const handleEdit = (id?: string) => {
    console.log("Edit transaction with ID:", id);
    if (!id) return;
  }

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await TransactionService.deleteTransaction(id);
      setUserTransactions(prevTransactions =>
        prevTransactions.filter(transaction => transaction.id !== id)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  useEffect(() => {
    if (userTransactions && userTransactions.length > 0) return;

    const fetchTransactions = async () => {
      try {
        const response = await TransactionService.getTransactions();
        setUserTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
    fetchTransactions();
  }, [userTransactions]);

  return (
    <div className="w-full">
      <div
        className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-muted-foreground bg-card/50 rounded-t-md border-b-0 border border-border">
        <div className="sm:col-span-5">Transaction</div>
        <div className="sm:col-span-3">Category</div>
        <div className="sm:col-span-2">Date</div>
        <div className="sm:col-span-2 text-right pr-8">Amount</div>
      </div>

      <Accordion type="multiple" className="w-full bg-card border border-border">
        {userTransactions.map((transaction, idx) => {
          const isIncome = transaction?.type === TransactionType.INCOME;
          return (
            <AccordionItem
              key={transaction.id}
              value={idx.toString()}
              className="border-b"
            >
              <AccordionTrigger
                className="rounded-none hover:no-underline hover:bg-accent/50 px-4 py-3 text-sm cursor-pointer transition-colors">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 w-full text-left items-center">
                  <div className="sm:col-span-5 font-semibold truncate">
                    {transaction?.description ?? 'N/A'}
                  </div>

                  <div className="sm:col-span-3 text-muted-foreground hidden sm:block">
                    {transaction?.category?.name ?? 'N/A'}
                  </div>

                  <div className="sm:col-span-2 text-muted-foreground hidden sm:block">
                    {formatDate(transaction?.transaction_date)}
                  </div>

                  <div className={cn(
                    'sm:col-span-2 sm:text-right font-semibold',
                    isIncome ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {isIncome ? '+' : '-'}{formatMoney(transaction?.amount, transaction?.currency?.code)}
                  </div>

                  <div className="sm:hidden text-xs text-muted-foreground col-span-1 mt-1">
                    {formatDate(transaction?.transaction_date)} • {transaction?.category?.name}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-0 border-t border-border/40 bg-accent/5">
                <div className="px-4 sm:px-6 py-4 sm:py-5">
                  {transaction?.description && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Description</div>
                      <div className="text-sm text-foreground">{transaction?.description}</div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(transaction?.id)}
                      className="cursor-pointer flex-1 sm:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                      Edit Transaction
                    </button>
                    <button
                      onClick={() => handleDelete(transaction?.id)}
                      className="cursor-pointer flex-1 sm:flex-none px-4 py-2 bg-card text-danger border border-border rounded-lg text-sm font-semibold hover:bg-danger/5 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

export default Transactions;