import axios from "axios";
import useUserStore from "@/store/user-store";
import {ApiRoutes} from "@/enum/api-routes";

const getUser = async () => {
  const response = await axios.get(ApiRoutes.USER);
  return response.data;
}

const refreshUser = async () => {
  const res = await fetch(ApiRoutes.USER);
  const updatedUser = await res.json();
  useUserStore.getState().setUser(updatedUser);
}

const getUserBalance = async () => {
  const response = await axios.get(ApiRoutes.USER_BALANCE);
  return response.data?.data?.balance;
}

const updateUser = async (payload: { preferred_currency_id: number }) => {
  const response = await axios.patch(ApiRoutes.USER, payload);
  return response.data;
}

export const UserService = {
  getUser,
  refreshUser,
  getUserBalance,
  updateUser
}