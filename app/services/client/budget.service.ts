import axios from "axios";
import {ApiRoutes} from "@/enum/api-routes";
import {Budget, BudgetRequest} from "@/types/budget";
import {BudgetSummary} from "@/types/budget-summary";

const getBudgets = async (): Promise<{data: Budget[]}> => {
  const response = await axios.get(ApiRoutes.BUDGET);
  return response.data;
}

const getBudgetById = async (budgetId: string): Promise<Budget> => {
  const response = await axios.get(`${ApiRoutes.BUDGET}/${budgetId}`);
  return response.data.data;
}

const getBudgetSummary = async (): Promise<BudgetSummary[]> => {
  const response = await axios.get(ApiRoutes.BUDGET_SUMMARY);
  return response.data.data;
}

const createBudget = async (budgetData: BudgetRequest) => {
  const response = await axios.post(ApiRoutes.BUDGET, {
    category_id: budgetData.categoryId,
    amount: budgetData.amount,
    period_start: budgetData.periodStart,
    period_end: budgetData.periodEnd
  });
  return response.data;
}

const updateBudget = async (budgetId: string, budgetData: BudgetRequest) => {
  const response = await axios.put(`${ApiRoutes.BUDGET}/${budgetId}`, {
    category_id: budgetData.categoryId,
    amount: budgetData.amount,
    period_start: budgetData.periodStart,
    period_end: budgetData.periodEnd
  });
  return response.data;
}

const deleteBudget = async (budgetId: string) => {
  const response = await axios.delete(`${ApiRoutes.BUDGET}/${budgetId}`);
  return response.data;
}

export const BudgetService = {
  getBudgets,
  getBudgetById,
  getBudgetSummary,
  createBudget,
  updateBudget,
  deleteBudget
}