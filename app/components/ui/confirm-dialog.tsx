"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useConfirmStore from "@/store/confirm-store";

export default function ConfirmDialog() {
  const { open, options, close } = useConfirmStore();

  const {
    title = "Are you sure?",
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    destructive = false,
  } = options;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) close(false);
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => close(false)}
          >
            {cancelText}
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            className="flex-1 cursor-pointer"
            onClick={() => close(true)}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
