import { create } from "zustand";

export type PageActionConfig = {
  label: string;
  onClick: () => void;
};

type PageActionState = {
  action: PageActionConfig | null;
  setAction: (action: PageActionConfig | null) => void;
};

const usePageActionStore = create<PageActionState>((set) => ({
  action: null,
  setAction: (action) => set({ action }),
}));

export default usePageActionStore;
