'use client'

import React, { useEffect } from "react";
import useUserStore from "@/store/user-store";
import {User} from "@/types/user";

type Props = {
  user: User | null | undefined;
}

const LoadUserToStore: React.FC<Props> = ({ user }) => {
  const {setUser} = useUserStore();

  useEffect(() => {
    if (!user) {
      return;
    }

    setUser(user);
  }, [user, setUser]);

  return null;
}

export default LoadUserToStore;