"use client"

import React, {useEffect, useState} from "react"
import {SquarePen} from "lucide-react"
import {Dialog, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Formik, FormikProps} from "formik"
import {TransactionType} from "@/enum/transaction-type"
import {TransactionService} from "@/service/client/transaction.service"
import {MoneyLocationService} from "@/service/client/money-location.service"
import {MoneyLocation} from "@/types/money-location"
import {RequestTransaction} from "@/types/request/request-transaction"
import {ResponseTransaction} from "@/types/response/response-transaction"
import {useGroupedCategories} from "@/hooks/use-grouped-categories"
import {useTags} from "@/hooks/use-tags"
import {TagService} from "@/service/client/tag.service"
import TransactionFields from "@/components/common/operation-form/transaction-fields"
import {transactionSchema} from "@/components/common/operation-form/schema"
import {TransactionFormValues} from "@/components/common/operation-form/types"
import {dateInputToTimestamp, normalizeDateToInput} from "@/helpers/utils"
import {toast} from "@/store/toast-store"

type Props = {
  transaction: ResponseTransaction;
  onSuccess?: () => void;
}

const EditTransactionDialog: React.FC<Props> = ({transaction, onSuccess}) => {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<MoneyLocation[]>([]);

  const groupedCategories = useGroupedCategories(open);
  const {tags: tagSuggestions, refetch: refetchTags} = useTags(open);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    MoneyLocationService.getLocations()
      .then(({data}) => {
        if (mounted) setLocations(data ?? []);
      })
      .catch((error) => console.error("Error fetching locations:", error));

    return () => {
      mounted = false;
    };
  }, [open]);

  const formInitState: TransactionFormValues = {
    type: transaction?.type ?? TransactionType.EXPENSE,
    amount: transaction?.amount ?? 0,
    location_id: transaction?.location?.id ?? null,
    category_id: transaction?.category?.id ?? null,
    description: transaction?.description ?? "",
    transaction_date: normalizeDateToInput(transaction?.transaction_date),
    tags: (transaction?.tags ?? []).map((tag) => tag.name),
  };

  const handleSubmit = async (values: TransactionFormValues) => {
    if (!transaction?.id) {
      console.error("EditTransactionDialog: cannot update, id is missing.", transaction);
      return;
    }

    const resolved = await TagService.resolveTags(values.tags);

    const payload: RequestTransaction = {
      tag_ids: resolved.map((tag) => tag.id),
      type: values.type,
      amount: Number(values.amount),
      location_id: values.location_id,
      category_id: values.category_id,
      description: values.description || "General transaction",
      transaction_date:
        values.transaction_date === normalizeDateToInput(transaction?.transaction_date)
          ? transaction.transaction_date
          : dateInputToTimestamp(values.transaction_date),
    };

    try {
      await TransactionService.updateTransaction(transaction.id, payload);
      toast.success("Transaction updated");
      refetchTags();
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update transaction:", error);
      toast.error("Failed to update transaction");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 cursor-pointer sm:flex-none">
          <SquarePen className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Transaction</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={formInitState}
          validationSchema={transactionSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(form: FormikProps<TransactionFormValues>) => (
            <form onSubmit={form.handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="inline-flex w-full gap-0.5 rounded-md bg-foreground/5 p-0.5">
                  {[TransactionType.EXPENSE, TransactionType.INCOME].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        form.setFieldValue("type", type);
                        form.setFieldValue("category_id", null);
                      }}
                      className={`flex-1 cursor-pointer rounded-[0.4rem] px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                        form.values.type === type
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <TransactionFields
                form={form}
                locations={locations}
                groupedCategories={groupedCategories}
                tagSuggestions={tagSuggestions}
              />

              <div className="flex gap-3 pt-2">
                <DialogClose className="flex-1 cursor-pointer">Cancel</DialogClose>
                <Button
                  type="submit"
                  className="flex-2 cursor-pointer"
                  disabled={form.isSubmitting}
                >
                  Update
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default EditTransactionDialog;
