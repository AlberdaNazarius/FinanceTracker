"use client";

import { cn, formatDate, formatMoney } from "@/helpers/utils";
import { TransactionService } from "@/service/client/transaction.service";
import { useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TransactionType } from "@/enum/transaction-type";
import EditTransactionDialog from "@/components/page/transactions/dialogs/edit-transaction-dialog/edit-transaction-dialog";
import { ResponseTransaction } from "@/types/response/response-transaction";
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react";
import { toast } from "@/store/toast-store";
import { confirm } from "@/store/confirm-store";

type TransactionTableProps = {
  transactions: ResponseTransaction[];
  refetch: () => Promise<void>;
};

const TransactionTable = ({ transactions, refetch }: TransactionTableProps) => {
  const handleDelete = useCallback(
    async (id?: string) => {
      if (!id) return;

      const confirmed = await confirm({
        title: "Delete transaction?",
        description: "This transaction will be permanently removed.",
        confirmText: "Delete",
        destructive: true,
      });
      if (!confirmed) return;

      try {
        await TransactionService.deleteTransaction(id);
        toast.success("Transaction deleted");
        await refetch();
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        toast.error("Failed to delete transaction");
      }
    },
    [refetch]
  );

  return (
    <div className="w-full">
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-muted-foreground bg-card/50 rounded-t-md border-b-0 border border-border">
        <div className="sm:col-span-5">Transaction</div>
        <div className="sm:col-span-3">Category</div>
        <div className="sm:col-span-2">Date</div>
        <div className="sm:col-span-2 text-right pr-8">Amount</div>
      </div>

      <Accordion
        type="multiple"
        className="w-full bg-card border border-border rounded-b-lg overflow-hidden"
      >
        {transactions.length > 0 ? (
          transactions.map((transaction, idx) => {
            const isIncome = transaction?.type === TransactionType.INCOME;
            return (
              <AccordionItem
                key={transaction.id}
                value={idx.toString()}
                className="border-b"
              >
                <AccordionTrigger className="rounded-none hover:no-underline hover:bg-accent/50 px-3 sm:px-4 py-3 sm:py-3 text-sm cursor-pointer transition-colors">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 w-full text-left items-center">
                    {/* Mobile Layout */}
                    <div className="sm:hidden w-full space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <div
                            className={cn(
                              "mt-0.5 p-1 rounded-full shrink-0",
                              isIncome
                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                : "bg-red-100 dark:bg-red-900/30"
                            )}
                          >
                            {isIncome ? (
                              <ArrowUpCircle
                                className={cn(
                                  "h-4 w-4",
                                  isIncome
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400"
                                )}
                              />
                            ) : (
                              <ArrowDownCircle
                                className={cn(
                                  "h-4 w-4",
                                  isIncome
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400"
                                )}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-foreground truncate">
                              {transaction?.description ?? "N/A"}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                              {transaction?.category && (
                                <div
                                  className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] shrink-0"
                                  style={{
                                    backgroundColor: `${transaction.category.color}20`,
                                  }}
                                >
                                  {transaction.category.icon}
                                </div>
                              )}
                              <span>
                                {transaction?.category?.name ?? "N/A"} •{" "}
                                {formatDate(transaction?.transaction_date)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "text-right font-semibold text-base shrink-0",
                            isIncome
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {isIncome ? "+" : "-"}
                          {formatMoney(
                            transaction?.amount,
                            transaction?.currency?.code
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:grid sm:grid-cols-12 sm:col-span-12 gap-4 w-full">
                      <div className="sm:col-span-5 font-semibold truncate">
                        {transaction?.description ?? "N/A"}
                      </div>

                      <div className="sm:col-span-3 text-muted-foreground flex items-center gap-2">
                        {transaction?.category && (
                          <div
                            className="flex h-6 w-6 items-center justify-center rounded-full text-xs shrink-0"
                            style={{
                              backgroundColor: `${transaction.category.color}20`,
                            }}
                          >
                            {transaction.category.icon}
                          </div>
                        )}
                        <span>{transaction?.category?.name ?? "N/A"}</span>
                      </div>

                      <div className="sm:col-span-2 text-muted-foreground">
                        {formatDate(transaction?.transaction_date)}
                      </div>

                      <div
                        className={cn(
                          "sm:col-span-2 sm:text-right font-semibold",
                          isIncome
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {isIncome ? "+" : "-"}
                        {formatMoney(
                          transaction?.amount,
                          transaction?.currency?.code
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="p-0 border-t border-border/40 bg-accent/5">
                  <div className="px-3 sm:px-6 py-4 sm:py-5">
                    {transaction?.description && (
                      <div className="sm:col-span-2 lg:col-span-3 mb-4">
                        <div className="text-xs font-semibold text-muted-foreground mb-1.5">
                          Description
                        </div>
                        <div className="text-sm text-foreground">
                          {transaction?.description}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <EditTransactionDialog
                        transaction={transaction}
                        onSuccess={refetch}
                      />
                      <button
                        onClick={() => handleDelete(transaction?.id)}
                        className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-card text-danger border border-danger/30 rounded-lg text-sm font-semibold hover:bg-danger/10 active:scale-[0.98] transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })
        ) : (
          <div className="px-4 py-8 text-center text-muted-foreground">
            No transactions found
          </div>
        )}
      </Accordion>
    </div>
  );
};

export default TransactionTable;
