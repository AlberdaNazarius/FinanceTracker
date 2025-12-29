import { create } from "zustand";
import {User} from "@/types/user";
import {TransactionType} from "@/enum/transaction-type";

type UserState = {
  user: User | null;
  setUser: (profile: User | null) => void;
  // updateBalance: (amount: number, type: TransactionType) => void;
  clear: () => void;
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  // updateBalance: (amount, type) =>
  //   set((state) => {
  //     if (!state.user) return state;
  //
  //     const diff = type === TransactionType.INCOME ? amount : -amount;
  //
  //     return {
  //       user: {
  //         ...state.user,
  //         balance: state.user.balance + diff
  //       }
  //     };
  //   }),
  clear: () => set({ user: null }),
}));

export default useUserStore;