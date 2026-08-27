"use client"

import React, {useEffect, useState} from "react"
import {SquarePen} from "lucide-react"
import {Dialog, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Formik, FormikProps} from "formik"
import {TransferService} from "@/service/client/transfer.service"
import {MoneyLocationService} from "@/service/client/money-location.service"
import {MoneyLocation} from "@/types/money-location"
import {RequestTransfer, ResponseTransfer} from "@/types/transfer"
import TransferFields from "@/components/common/operation-form/transfer-fields"
import {transferSchema} from "@/components/common/operation-form/schema"
import {TransferFormValues} from "@/components/common/operation-form/types"
import {normalizeDateToInput} from "@/helpers/utils"
import {toast} from "@/store/toast-store"

type Props = {
  transfer: ResponseTransfer;
  onSuccess?: () => void;
}

const EditTransferDialog: React.FC<Props> = ({transfer, onSuccess}) => {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<MoneyLocation[]>([]);

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

  const formInitState: TransferFormValues = {
    from_location_id: transfer?.from_location?.id ?? null,
    to_location_id: transfer?.to_location?.id ?? null,
    from_amount: transfer?.from_amount ?? 0,
    to_amount: transfer?.to_amount ?? 0,
    fee_amount: transfer?.fee_amount ?? 0,
    description: transfer?.description ?? "",
    transfer_date: normalizeDateToInput(transfer?.transfer_date),
  };

  const handleSubmit = async (values: TransferFormValues) => {
    if (!transfer?.id) return;

    const payload: RequestTransfer = {
      from_location_id: values.from_location_id!,
      to_location_id: values.to_location_id!,
      from_amount: Number(values.from_amount),
      to_amount: Number(values.to_amount),
      fee_amount: Number(values.fee_amount) || 0,
      description: values.description || undefined,
      transfer_date: new Date(values.transfer_date),
    };

    try {
      await TransferService.updateTransfer(transfer.id, payload);
      toast.success("Transfer updated");
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update transfer:", error);
      toast.error("Failed to update transfer");
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
          <DialogTitle className="text-xl font-bold">Edit Transfer</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={formInitState}
          validationSchema={transferSchema}
          onSubmit={handleSubmit}
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

export default EditTransferDialog;
