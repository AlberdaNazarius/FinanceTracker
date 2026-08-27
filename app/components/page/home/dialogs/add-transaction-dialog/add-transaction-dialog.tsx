"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Formik, FormikProps } from "formik";
import { TransactionType } from "@/enum/transaction-type";
import { OperationKind } from "@/enum/operation-kind";
import { TransactionService } from "@/service/client/transaction.service";
import { TransferService } from "@/service/client/transfer.service";
import { MoneyLocationService } from "@/service/client/money-location.service";
import { MoneyLocation } from "@/types/money-location";
import { RequestTransaction } from "@/types/request/request-transaction";
import { RequestTransfer } from "@/types/transfer";
import { useGroupedCategories } from "@/hooks/use-grouped-categories";
import OperationTypeSwitch, {
  OperationFormType,
} from "@/components/common/operation-form/operation-type-switch";
import TransactionFields from "@/components/common/operation-form/transaction-fields";
import TransferFields from "@/components/common/operation-form/transfer-fields";
import {
  transactionSchema,
  transferSchema,
} from "@/components/common/operation-form/schema";
import {
  TransactionFormValues,
  TransferFormValues,
} from "@/components/common/operation-form/types";
import { dateInputToTimestamp } from "@/helpers/utils";
import { toast } from "@/store/toast-store";

type Props = {
  onSuccess?: () => void;
};

const today = () => new Date().toISOString().split("T")[0];

const AddTransactionDialog: React.FC<Props> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<OperationFormType>(
    TransactionType.EXPENSE,
  );
  const [locations, setLocations] = useState<MoneyLocation[]>([]);

  const groupedCategories = useGroupedCategories(open);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    MoneyLocationService.getLocations()
      .then(({ data }) => {
        if (mounted) setLocations((data ?? []).filter((l) => !l.archived));
      })
      .catch((error) => console.error("Error fetching locations:", error));

    return () => {
      mounted = false;
    };
  }, [open]);

  const defaultLocationId = useMemo(
    () => locations.find((location) => location.is_default)?.id ?? locations[0]?.id ?? null,
    [locations],
  );

  const transactionInitState: TransactionFormValues = {
    type: operationType === OperationKind.TRANSFER ? TransactionType.EXPENSE : operationType,
    amount: "",
    location_id: defaultLocationId,
    category_id: null,
    description: "",
    transaction_date: today(),
  };

  const transferInitState: TransferFormValues = {
    from_location_id: defaultLocationId,
    to_location_id: null,
    from_amount: "",
    to_amount: "",
    fee_amount: "",
    description: "",
    transfer_date: today(),
  };

  const handleTransactionSubmit = async (values: TransactionFormValues) => {
    const payload: RequestTransaction = {
      type: values.type,
      amount: Number(values.amount),
      location_id: values.location_id,
      category_id: values.category_id,
      description: values.description || "General transaction",
      transaction_date: dateInputToTimestamp(values.transaction_date),
    };

    try {
      await TransactionService.addTransaction(payload);
      toast.success("Transaction added");
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Failed to add transaction:", error);
      toast.error("Failed to add transaction");
    }
  };

  const handleTransferSubmit = async (values: TransferFormValues) => {
    const payload: RequestTransfer = {
      from_location_id: values.from_location_id!,
      to_location_id: values.to_location_id!,
      from_amount: Number(values.from_amount),
      to_amount: Number(values.to_amount),
      fee_amount: Number(values.fee_amount) || 0,
      description: values.description || undefined,
      transfer_date: dateInputToTimestamp(values.transfer_date),
    };

    try {
      await TransferService.addTransfer(payload);
      toast.success("Transfer added");
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Failed to add transfer:", error);
      toast.error("Failed to add transfer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {operationType === OperationKind.TRANSFER ? "New Transfer" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <OperationTypeSwitch value={operationType} onChange={setOperationType} />
        </div>

        {operationType === OperationKind.TRANSFER ? (
          <Formik
            key="transfer-form"
            initialValues={transferInitState}
            validationSchema={transferSchema}
            onSubmit={handleTransferSubmit}
            enableReinitialize
          >
            {(form: FormikProps<TransferFormValues>) => (
              <form onSubmit={form.handleSubmit} className="space-y-4 mt-4">
                <TransferFields form={form} locations={locations} />
                <div className="flex gap-3 pt-2">
                  <DialogClose className="flex-1 cursor-pointer">Cancel</DialogClose>
                  <Button
                    type="submit"
                    className="flex-2 cursor-pointer"
                    disabled={form.isSubmitting}
                  >
                    Transfer
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        ) : (
          <Formik
            key="transaction-form"
            initialValues={transactionInitState}
            validationSchema={transactionSchema}
            onSubmit={handleTransactionSubmit}
            enableReinitialize
          >
            {(form: FormikProps<TransactionFormValues>) => (
              <form onSubmit={form.handleSubmit} className="space-y-4 mt-4">
                <TransactionFields
                  form={form}
                  locations={locations}
                  groupedCategories={groupedCategories}
                />
                <div className="flex gap-3 pt-2">
                  <DialogClose className="flex-1 cursor-pointer">Cancel</DialogClose>
                  <Button
                    type="submit"
                    className="flex-2 cursor-pointer"
                    disabled={form.isSubmitting}
                  >
                    Add
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
