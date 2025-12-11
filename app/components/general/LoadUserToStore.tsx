'use client'

import { useEffect } from "react";
import useUserStore from "@/store/UserStore";
import {User} from "@/types/user";

export default function LoadUserToStore({ user }: { user: User | null | undefined }) {
  const {setUser} = useUserStore();

  useEffect(() => {
    if (!user) {
      return;
    }

    setUser(user);
  }, [user, setUser]);

  return null;
}
