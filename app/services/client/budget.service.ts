import axios from "axios";
import {ApiRoutes} from "@/enum/api-routes";
import {BudgetCreate, BudgetUpdate} from "@/types/budget";

const getBudgetView = async () => {
  const response = await axios.get(ApiRoutes.BUDGET);
  return response.data;
}

const createBudget = async (budgetData: BudgetCreate) => {
  const response = await axios.post(ApiRoutes.BUDGET, budgetData);
  return response.data;
}

const updateBudget = async (budgetId: number, budgetData: BudgetUpdate) => {
  const response = await axios.put(`${ApiRoutes.BUDGET}/${budgetId}`, budgetData);
  return response.data;
}

const deleteBudget = async (budgetId: number) => {
  const response = await axios.delete(`${ApiRoutes.BUDGET}/${budgetId}`);
  return response.data;
}

export const BudgetService = {
  getBudgetView,
  createBudget,
  updateBudget,
  deleteBudget
}