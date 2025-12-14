import axios from "axios";
import useUserStore from "@/store/user-store";
import {ApiRoutes} from "@/enum/api-routes";

const getUser = async () => {
  const response = await axios.get(ApiRoutes.USER);
  return response.data;
}

async function refreshUser() {
  const res = await fetch(ApiRoutes.USER);
  const updatedUser = await res.json();
  useUserStore.getState().setUser(updatedUser);
}

export const UserService = {
  getUser,
  refreshUser,
}