import axios from "axios";
import {ApiRoutes} from "@/enum/api-routes";
import {CategoryCreate} from "@/types/category";

const getCategories = async () => {
  const response = await axios.get(ApiRoutes.CATEGORY);
  return response.data;
}

const addCategory = async (category: CategoryCreate) => {
  const response = await axios.post(ApiRoutes.CATEGORY, category);
  return response.data;
}

const updateCategory = async (id: string, category: CategoryCreate) => {
  const response = await axios.put(`${ApiRoutes.CATEGORY}/${id}`, category);
  return response.data;
}

const deleteCategory = async (id: string) => {
  const response = await axios.delete(`${ApiRoutes.CATEGORY}/${id}`);
  return response.data;
}

export const CategoryService = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
}