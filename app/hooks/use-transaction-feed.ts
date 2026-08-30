import { useCallback, useEffect, useMemo, useState } from "react";
import { TransactionService } from "@/service/client/transaction.service";
import { TransferService } from "@/service/client/transfer.service";
import { ResponseTransaction } from "@/types/response/response-transaction";
import { ResponseTransfer } from "@/types/transfer";
import { Operation } from "@/types/operation";
import { OperationKind } from "@/enum/operation-kind";

export function useTransactionFeed() {
  const [transactions, setTransactions] = useState<ResponseTransaction[]>([]);
  const [transfers, setTransfers] = useState<ResponseTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const [transactionResult, transferResult] = await Promise.all([
        TransactionService.getTransactions(),
        TransferService.getTransfers(),
      ]);
      setTransactions(transactionResult.data ?? []);
      setTransfers(transferResult.data ?? []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const operations = useMemo<Operation[]>(() => {
    const merged: Operation[] = [
      ...transactions.map((transaction) => ({
        kind: OperationKind.TRANSACTION as const,
        id: transaction.id,
        date: String(transaction.transaction_date),
        createdAt: String(transaction.created_at),
        transaction,
      })),
      ...transfers.map((transfer) => ({
        kind: OperationKind.TRANSFER as const,
        id: transfer.id,
        date: String(transfer.transfer_date),
        createdAt: String(transfer.created_at),
        transfer,
      })),
    ];

    const time = (value: string) => new Date(value).getTime();

    return merged.sort(
      (a, b) => time(b.date) - time(a.date) || time(b.createdAt) - time(a.createdAt)
    );
  }, [transactions, transfers]);

  return {
    operations,
    transactions,
    transfers,
    loading,
    error,
    refetch: fetchFeed
  };
}
