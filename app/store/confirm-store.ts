import { create } from "zustand";

export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

type ConfirmState = {
  open: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
  openConfirm: (options: ConfirmOptions) => Promise<boolean>;
  close: (result: boolean) => void;
};

const useConfirmStore = create<ConfirmState>((set, get) => ({
  open: false,
  options: {},
  resolve: null,
  openConfirm: (options) =>
    new Promise<boolean>((resolve) => {
      set({ open: true, options, resolve });
    }),
  close: (result) => {
    get().resolve?.(result);
    set({ open: false, resolve: null });
  },
}));

export const confirm = (options: ConfirmOptions = {}) =>
  useConfirmStore.getState().openConfirm(options);

export default useConfirmStore;
