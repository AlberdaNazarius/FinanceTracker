import axios from "axios";
import {ApiRoutes} from "@/enum/api-routes";
import {MoneyLocation, MoneyLocationRequest} from "@/types/money-location";

const getLocations = async (): Promise<{data: MoneyLocation[]}> => {
  const response = await axios.get(ApiRoutes.MONEY_LOCATION);
  return response.data;
}

const addLocation = async (location: MoneyLocationRequest) => {
  const response = await axios.post(ApiRoutes.MONEY_LOCATION, location);
  return response.data;
}

const updateLocation = async (id: string, location: Partial<MoneyLocationRequest>) => {
  const response = await axios.put(`${ApiRoutes.MONEY_LOCATION}/${id}`, location);
  return response.data;
}

const deleteLocation = async (id: string) => {
  const response = await axios.delete(`${ApiRoutes.MONEY_LOCATION}/${id}`);
  return response.data;
}

export const MoneyLocationService = {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation
}
