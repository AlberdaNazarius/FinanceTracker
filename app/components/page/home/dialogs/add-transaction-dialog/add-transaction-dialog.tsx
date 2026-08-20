"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/enum/transaction-type";
import { TransactionService } from "@/service/client/transaction.service";
import { Formik } from "formik";
import { transactionSchema } from "./schema";
import { CategoryService } from "@/service/client/category.service";
import { Category } from "@/types/category";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/helpers/constants";
import { RequestTransaction } from "@/types/request/request-transaction";
import useUserStore from "@/store/user-store";
import { getCurrencySymbol } from "@/helpers/utils";
import { toast } from "@/store/toast-store";
import { Plus } from "lucide-react";

type Props = {
  onSuccess?: () => void;
};

type GroupedCategories = {
  [key in TransactionType]?: Category[];
};

type TransactionFormValues = Omit<RequestTransaction, "transaction_date"> & {
  transaction_date: string;
};

const getSymbolByCurrencyId = (id: number) =>
  getCurrencySymbol(CURRENCIES.find((currency) => currency.id === id)?.code);

const AddTransactionDialog: React.FC<Props> = ({ onSuccess }) => {
  const { user } = useUserStore();

  const formInitState: TransactionFormValues = {
    category_id: null,
    currency_id: user?.preferredCurrency?.id ?? DEFAULT_CURRENCY.id,
    amount: 0,
    type: TransactionType.EXPENSE,
    description: "",
    transaction_date: new Date().toISOString().split("T")[0],
  };

  const [open, setOpen] = useState(false);
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategories>(
    {},
  );

  const handleSubmit = async (values: TransactionFormValues) => {
    if (!values) return;

    const newTransaction: RequestTransaction = {
      ...values,
      description: values.description
        ? values.description
        : "General transaction",
      transaction_date: new Date(values.transaction_date),
    };

    try {
      await TransactionService.addTransaction(newTransaction);
      toast.success("Transaction added");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to add transaction:", error);
      toast.error("Failed to add transaction");
    }

    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const fetchData = async (): Promise<Category[] | undefined> => {
      try {
        const response = await CategoryService.getCategories();
        //console.log("Fetched data:", response);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const groupCategories = async () => {
      const categories = await fetchData();
      if (!categories) {
        return;
      }

      const categoriesByType = categories.reduce<GroupedCategories>(
        (acc, category) => {
          const { type } = category;

          if (!acc[type]) {
            acc[type] = [];
          }

          acc[type].push(category);

          return acc;
        },
        {},
      );
      setGroupedCategories(categoriesByType);
    };

    groupCategories();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Transaction
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={formInitState}
          validationSchema={transactionSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            setFieldValue,
            touched,
            errors,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    {/* <span className="absolute left-3 top-1.5 text-muted-foreground">
                      {getSymbolByCurrencyId(values.currency_id)}
                    </span> */}
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={values.amount}
                      onChange={handleChange}
                    />
                  </div>
                  {touched.amount && errors.amount && (
                    <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
                  )}
                </div>

                <div className="space-y-2 sm:w-32">
                  <Label>Currency</Label>
                  <Select
                    name="currency_id"
                    value={String(values.currency_id)}
                    onValueChange={(val) =>
                      setFieldValue("currency_id", Number(val))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem
                          key={currency.id}
                          value={String(currency.id)}
                        >
                          <span className="font-semibold">
                            {getCurrencySymbol(currency.code)}
                          </span>
                          {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touched.currency_id && errors.currency_id && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.currency_id}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <Label>Type</Label>
                  <Select
                    name="type"
                    value={values.type}
                    onValueChange={(val) => setFieldValue("type", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TransactionType.EXPENSE}>
                        Expenses
                      </SelectItem>
                      <SelectItem value={TransactionType.INCOME}>
                        Income
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {touched.type && errors.type && (
                    <p className="text-sm text-red-500 mt-1">{errors.type}</p>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <Label>Category</Label>
                  <Select
                    name="category_id"
                    value={values?.category_id ?? ""}
                    onValueChange={(val) => setFieldValue("category_id", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {groupedCategories[values.type]?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      {(!groupedCategories[values.type] ||
                        groupedCategories[values.type]?.length === 0) && (
                        <div className="p-2 text-xs text-center text-muted-foreground">
                          No {values.type} categories found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {touched.category_id && errors.category_id && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.category_id}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Add a note (optional)"
                  value={values.description}
                  onChange={handleChange}
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction_date">Date</Label>
                <Input
                  id="transaction_date"
                  type="date"
                  value={values.transaction_date}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <DialogClose className="flex-1 cursor-pointer">
                  Cancel
                </DialogClose>
                <Button type="submit" className="flex-2 cursor-pointer">
                  Add
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;