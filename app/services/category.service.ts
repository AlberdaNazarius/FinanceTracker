import axios from "axios";
import {ApiRoutes} from "@/enum/api-routes";

const getCategories = async () => {
  const response = await axios.get(ApiRoutes.CATEGORY);
  return response.data;
}

export const CategoryService = {
  getCategories
}