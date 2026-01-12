"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import { BudgetService } from "@/service/client/budget.service";
import { CategoryService } from "@/service/client/category.service";
import { Category } from "@/types/category";
import {Budget, BudgetRequest} from "@/types/budget";
import { TransactionType } from "@/enum/transaction-type";
import useUserStore from "@/store/user-store";
import { getCurrencySymbol, normalizeDateToInput } from "@/helpers/utils";
import {budgetSchema} from "@/components/page/budget/dialogs/add-budget-dialog/schema";

type Props = {
  budget?: Budget | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};

const AddBudgetDialog: React.FC<Props> = ({ budget, open: controlledOpen, onOpenChange, onSuccess }) => {
  const currencySymbol = useUserStore((state) => getCurrencySymbol(state.user?.preferredCurrency?.code));
  const [internalOpen, setInternalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const formInitState: BudgetRequest = {
    categoryId: budget?.category?.id ?? "",
    amount: budget?.amount ?? 0,
    periodStart: budget?.periodStart ?? normalizeDateToInput(firstDayOfMonth),
    periodEnd: budget?.periodEnd ?? normalizeDateToInput(lastDayOfMonth),
  };

  const handleSubmit = async (values: BudgetRequest) => {
    if (!values) return;
    setOpen(false);

    try {
      if (budget) {
        await BudgetService.updateBudget(budget.id, values);
      } else {
        await BudgetService.createBudget(values);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save budget:", error);
    }
  };

  useEffect(() => {
    if (!open) return;

    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();

        const expenseCategories = response.data.filter((c) => c.type === TransactionType.EXPENSE);
        setCategories(expenseCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger
          className="w-full bg-primary font-semibold text-primary-foreground px-6 py-3.5 rounded-lg hover:bg-primary/90 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {budget ? "Edit Budget" : "Add Budget"}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {budget ? "Edit Budget" : "Add Budget"}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={formInitState}
          validationSchema={budgetSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, handleChange, handleSubmit, setFieldValue, touched, errors }) => (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select
                  name="category_id"
                  value={values.categoryId}
                  onValueChange={(val) => setFieldValue("category_id", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    {categories.length === 0 && (
                      <div className="p-2 text-xs text-center text-muted-foreground">
                        No expense categories found
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {touched.categoryId && errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1.5 text-muted-foreground">{currencySymbol}</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={values.amount}
                    onChange={handleChange}
                  />
                  {touched.amount && errors.amount && (
                    <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period_start">Period Start</Label>
                <Input
                  id="period_start"
                  type="date"
                  value={values.periodStart}
                  onChange={handleChange}
                />
                {touched.periodStart && errors.periodStart && (
                  <p className="text-sm text-red-500 mt-1">{errors.periodStart}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="period_end">Period End</Label>
                <Input
                  id="period_end"
                  type="date"
                  value={values.periodEnd}
                  onChange={handleChange}
                />
                {touched.periodEnd && errors.periodEnd && (
                  <p className="text-sm text-red-500 mt-1">{errors.periodEnd}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <DialogClose className="flex-1 cursor-pointer">
                  Cancel
                </DialogClose>
                <Button type="submit" className="flex-2 cursor-pointer">
                  {budget ? "Save Changes" : "Add"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetDialog;
