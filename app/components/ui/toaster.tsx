"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import useToastStore from "@/store/toast-store";
import { cn } from "@/helpers/utils";

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const remove = useToastStore((state) => state.remove);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-100 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={cn(
            "flex items-start gap-3 rounded-lg border bg-card p-3.5 shadow-lg animate-in fade-in slide-in-from-top-2",
            toast.type === "success" ? "border-success/30" : "border-danger/30"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
          )}
          <p className="flex-1 text-sm text-foreground">{toast.message}</p>
          <button
            onClick={() => remove(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
