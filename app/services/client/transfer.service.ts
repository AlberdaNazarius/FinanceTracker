import axios from "axios";
import {ApiRoutes} from "@/enum/api-routes";
import {RequestTransfer, ResponseTransfer} from "@/types/transfer";

const getTransfers = async (): Promise<{data: ResponseTransfer[]}> => {
  const response = await axios.get(ApiRoutes.TRANSFER);
  return response.data;
}

const addTransfer = async (transfer: RequestTransfer) => {
  const response = await axios.post(ApiRoutes.TRANSFER, transfer);
  return response.data;
}

const updateTransfer = async (id: string, transfer: RequestTransfer) => {
  const response = await axios.put(`${ApiRoutes.TRANSFER}/${id}`, transfer);
  return response.data;
}

const deleteTransfer = async (id: string) => {
  const response = await axios.delete(`${ApiRoutes.TRANSFER}/${id}`);
  return response.data;
}

export const TransferService = {
  getTransfers,
  addTransfer,
  updateTransfer,
  deleteTransfer
}
