"use client"

import React, {useEffect, useState} from "react"
import {Dialog, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {TransactionType} from "@/enum/transaction-type";
import {TransactionService} from "@/service/transaction.service";
import {Formik} from 'formik';
import {transactionSchema} from "@/components/dialogs/add-transaction-modal/schema";
import {CategoryService} from "@/service/category.service";
import {Category} from "@/types/category";
import {CURRENCIES} from "@/helpers/constants";
import {RequestTransaction} from "@/types/request/request_transaction";
import useUserStore from "@/store/UserStore";
import {UserService} from "@/service/user.service";
import {getCurrencySymbol} from "@/helpers/utils";

const AddTransactionModal: React.FC = () => {
  const {updateBalance} = useUserStore();
  const currencySymbol = useUserStore(state =>
    getCurrencySymbol(state.user?.preferred_currency?.code)
  );

  const formInitState: RequestTransaction = {
    category_id: null,
    currency_id: CURRENCIES[0].id,
    amount: 0,
    type: TransactionType.EXPENSE,
    description: "",
    transaction_date: new Date(),
  }

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleSubmit = async (values: RequestTransaction) => {
    if (!values) return;

    updateBalance(values.amount, values.type);
    setOpen(false);

    const newTransaction: RequestTransaction = {
      ...values,
      description: values.description ? values.description : 'General transaction',
      transaction_date: new Date(values.transaction_date)
    }
    await TransactionService.addTransaction(newTransaction);
    await UserService.refreshUser();
  }

  useEffect(() => {
    if(!open) return;
    
    const fetchData = async () => {
      try {
        const response = await CategoryService.getCategories();
        //console.log("Fetched data:", response);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="w-full bg-primary font-bold text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors cursor-pointer">
        Add Transaction
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Transaction</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={formInitState}
          validationSchema={transactionSchema}
          onSubmit={handleSubmit}
        >
          {({values, handleChange, handleSubmit, setFieldValue, touched, errors}) => (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
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
                {touched.amount && errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  name='type'
                  value={values.type}
                  onValueChange={(val) => setFieldValue("type", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TransactionType.EXPENSE}>Expenses</SelectItem>
                    <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                  </SelectContent>
                </Select>
                {touched.type && errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  name='category_id'
                  value={values?.category_id ?? ""}
                  onValueChange={(val) =>
                    setFieldValue("category_id", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category"/>
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.category_id && errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Add a note (optional)"
                  value={values.description}
                  onChange={handleChange}
                />
                {touched.description && errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction_date">Date</Label>
                <Input
                  id="transaction_date"
                  type="date"
                  value={values.transaction_date.toISOString().split('T')[0]}
                  onChange={handleChange}
                />
              </div>
              {touched.currency_id && errors.currency_id && <p className="text-sm text-red-500 mt-1">{errors.currency_id}</p>}

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
}

export default AddTransactionModal;