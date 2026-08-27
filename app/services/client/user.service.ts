import axios from "axios";
import useUserStore from "@/store/user-store";
import {ApiRoutes} from "@/enum/api-routes";
import {ResponseBalance} from "@/types/response/response-balance";
import {DashboardSettings} from "@/types/dashboard-settings";
import {toUser} from "@/helpers/user-mapper";

const getUser = async () => {
  const response = await axios.get(ApiRoutes.USER);
  return response.data;
}

const refreshUser = async () => {
  const response = await axios.get(ApiRoutes.USER);
  useUserStore.getState().setUser(toUser(response.data?.data));
}

const getUserBalance = async (): Promise<ResponseBalance> => {
  const response = await axios.get(ApiRoutes.USER_BALANCE);
  return response.data?.data;
}

const updateUser = async (payload: {
  preferred_currency_id?: number;
  dashboard_settings?: DashboardSettings;
}) => {
  const response = await axios.patch(ApiRoutes.USER, payload);
  return response.data;
}

export const UserService = {
  getUser,
  refreshUser,
  getUserBalance,
  updateUser
}
