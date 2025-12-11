import { create } from "zustand";
import {User} from "@/types/user";

type UserState = {
  user: User | null;
  setUser: (profile: User | null) => void;
  clear: () => void;
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));

export default useUserStore;