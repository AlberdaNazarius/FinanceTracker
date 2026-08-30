"use client";

import { useCallback } from "react";
import { ArrowUpCircle, ArrowDownCircle, ArrowLeftRight, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, formatDate, formatMoney } from "@/helpers/utils";
import { TransactionService } from "@/service/client/transaction.service";
import { TransferService } from "@/service/client/transfer.service";
import { TransactionType } from "@/enum/transaction-type";
import { OperationKind } from "@/enum/operation-kind";
import { Operation } from "@/types/operation";
import { ResponseTransaction } from "@/types/response/response-transaction";
import { ResponseTransfer } from "@/types/transfer";
import EditTransactionDialog from "@/components/page/transactions/dialogs/edit-transaction-dialog/edit-transaction-dialog";
import EditTransferDialog from "@/components/page/transactions/dialogs/edit-transfer-dialog/edit-transfer-dialog";
import { toast } from "@/store/toast-store";
import { confirm } from "@/store/confirm-store";

type TransactionTableProps = {
  operations: Operation[];
  refetch: () => Promise<void>;
};

const TransactionRow = ({ transaction }: { transaction: ResponseTransaction }) => {
  const isIncome = transaction?.type === TransactionType.INCOME;
  const amountClass = isIncome
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-red-600 dark:text-red-400";
  const amount = `${isIncome ? "+" : "-"}${formatMoney(
    transaction?.amount,
    transaction?.currency?.code
  )}`;

  return (
    <>
      {/* Mobile */}
      <div className="sm:hidden w-full">
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
                <ArrowUpCircle className={cn("h-4 w-4", amountClass)} />
              ) : (
                <ArrowDownCircle className={cn("h-4 w-4", amountClass)} />
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
                    style={{ backgroundColor: `${transaction.category.color}20` }}
                  >
                    {transaction.category.icon}
                  </div>
                )}
                <span className="truncate">
                  {transaction?.category?.name ?? "N/A"}
                  {transaction?.location && ` · ${transaction.location.name}`} •{" "}
                  {formatDate(transaction?.transaction_date)}
                  {transaction?.tags?.map((tag) => ` #${tag.name}`).join("")}
                </span>
              </div>
            </div>
          </div>
          <div className={cn("text-right font-semibold text-base shrink-0", amountClass)}>
            {amount}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:grid sm:grid-cols-12 sm:col-span-12 gap-4 w-full">
        <div className="sm:col-span-5 min-w-0">
          <div className="font-semibold truncate">
            {transaction?.description ?? "N/A"}
          </div>
          {transaction?.location && (
            <div className="text-xs text-muted-foreground truncate">
              {transaction.location.icon} {transaction.location.name}
            </div>
          )}
          {transaction?.tags?.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {transaction.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="sm:col-span-3 text-muted-foreground flex items-center gap-2">
          {transaction?.category && (
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs shrink-0"
              style={{ backgroundColor: `${transaction.category.color}20` }}
            >
              {transaction.category.icon}
            </div>
          )}
          <span className="truncate">{transaction?.category?.name ?? "N/A"}</span>
        </div>

        <div className="sm:col-span-2 text-muted-foreground">
          {formatDate(transaction?.transaction_date)}
        </div>

        <div className={cn("sm:col-span-2 sm:text-right font-semibold", amountClass)}>
          {amount}
        </div>
      </div>
    </>
  );
};

const TransferRow = ({ transfer }: { transfer: ResponseTransfer }) => {
  const fromCode = transfer?.from_location?.currency?.code;
  const toCode = transfer?.to_location?.currency?.code;
  const crossCurrency = fromCode !== toCode;

  const route = `${transfer?.from_location?.name ?? "?"} → ${transfer?.to_location?.name ?? "?"}`;
  const sent = formatMoney(transfer?.from_amount, fromCode);
  const received = formatMoney(transfer?.to_amount, toCode);
  const fee = transfer?.fee_amount > 0 ? formatMoney(transfer.fee_amount, fromCode) : null;

  return (
    <>
      {/* Mobile */}
      <div className="sm:hidden w-full">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="mt-0.5 p-1 rounded-full shrink-0 bg-muted">
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground truncate">{route}</div>
              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                Transfer • {formatDate(transfer?.transfer_date)}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-semibold text-base text-foreground">{sent}</div>
            {crossCurrency && (
              <div className="text-xs text-muted-foreground">→ {received}</div>
            )}
            {fee && <div className="text-xs text-danger">fee {fee}</div>}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:grid sm:grid-cols-12 sm:col-span-12 gap-4 w-full">
        <div className="sm:col-span-5 min-w-0">
          <div className="font-semibold truncate">{route}</div>
          {transfer?.description && (
            <div className="text-xs text-muted-foreground truncate">
              {transfer.description}
            </div>
          )}
        </div>

        <div className="sm:col-span-3 text-muted-foreground flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted shrink-0">
            <ArrowLeftRight className="h-3 w-3" />
          </div>
          <span>Transfer</span>
        </div>

        <div className="sm:col-span-2 text-muted-foreground">
          {formatDate(transfer?.transfer_date)}
        </div>

        <div className="sm:col-span-2 sm:text-right">
          <div className="font-semibold text-foreground">{sent}</div>
          {crossCurrency && (
            <div className="text-xs text-muted-foreground">→ {received}</div>
          )}
          {fee && <div className="text-xs text-danger">fee {fee}</div>}
        </div>
      </div>
    </>
  );
};

const TransactionTable = ({ operations, refetch }: TransactionTableProps) => {
  const handleDelete = useCallback(
    async (operation: Operation) => {
      const isTransfer = operation.kind === OperationKind.TRANSFER;

      const confirmed = await confirm({
        title: isTransfer ? "Delete transfer?" : "Delete transaction?",
        description: "This operation will be permanently removed.",
        confirmText: "Delete",
        destructive: true,
      });
      if (!confirmed) return;

      try {
        if (isTransfer) {
          await TransferService.deleteTransfer(operation.id);
          toast.success("Transfer deleted");
        } else {
          await TransactionService.deleteTransaction(operation.id);
          toast.success("Transaction deleted");
        }
        await refetch();
      } catch (error) {
        console.error("Failed to delete operation:", error);
        toast.error("Failed to delete");
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
        {operations.length > 0 ? (
          operations.map((operation, idx) => {
            const description =
              operation.kind === OperationKind.TRANSACTION
                ? operation.transaction?.description
                : operation.transfer?.description;

            return (
              <AccordionItem
                key={`${operation.kind}-${operation.id}`}
                value={idx.toString()}
                className="border-b"
              >
                <AccordionTrigger className="rounded-none hover:no-underline hover:bg-accent/50 px-3 sm:px-4 py-3 sm:py-3 text-sm cursor-pointer transition-colors">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 w-full text-left items-center">
                    {operation.kind === OperationKind.TRANSACTION ? (
                      <TransactionRow transaction={operation.transaction} />
                    ) : (
                      <TransferRow transfer={operation.transfer} />
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent className="p-0 border-t border-border/40 bg-accent/5">
                  <div className="px-3 sm:px-6 py-4 sm:py-5">
                    {description && (
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-muted-foreground mb-1.5">
                          Description
                        </div>
                        <div className="text-sm text-foreground">{description}</div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {operation.kind === OperationKind.TRANSACTION ? (
                        <EditTransactionDialog
                          transaction={operation.transaction}
                          onSuccess={refetch}
                        />
                      ) : (
                        <EditTransferDialog
                          transfer={operation.transfer}
                          onSuccess={refetch}
                        />
                      )}
                      <button
                        onClick={() => handleDelete(operation)}
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
