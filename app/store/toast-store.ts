import { create } from "zustand";

export type ToastType = "success" | "error";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastState = {
  toasts: Toast[];
  add: (message: string, type: ToastType) => void;
  remove: (id: string) => void;
};

const TOAST_DURATION = 3500;

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (message, type) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, TOAST_DURATION);
  },
  remove: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().add(message, "success"),
  error: (message: string) => useToastStore.getState().add(message, "error"),
};

export default useToastStore;
