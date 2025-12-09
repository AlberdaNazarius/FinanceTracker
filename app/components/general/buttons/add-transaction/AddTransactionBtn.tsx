"use client"

import React from "react"
import {Dialog, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {CATEGORIES} from "@/helpers/data";
import {TransactionType} from "@/enum/TransactionType";
import {TransactionService} from "../../../../services/transaction.service";
import {Transaction} from "@/types/Transaction";
import {Formik} from 'formik';
import {transactionSchema} from "@/components/general/buttons/add-transaction/schema";

const AddTransactionBtn: React.FC = () => {
  const formInitState: Transaction = {
    amount: 0,
    type: TransactionType.EXPENSE,
    category: null,
    description: "",
    currency: "USD",
    transaction_date: new Date(),
  }

  const handleSubmit = async (values: Transaction) => {
    const newTransaction: Transaction = {
      ...values,
      transaction_date: new Date(values.transaction_date)
    }
    await TransactionService.addTransaction(newTransaction);
  }

  return (
    <Dialog>
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
          {({values, handleChange, handleSubmit, setFieldValue, errors}) => (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1.5 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={values.amount}
                    onChange={handleChange}
                  />
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
                    <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                    <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  name='category'
                  value={values?.category?.name ?? ""}
                  onValueChange={(val) =>
                    setFieldValue("category", { name: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category"/>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES?.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Add a note (optional)"
                  value={values.description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction_date">Date</Label>
                <Input
                  id="transaction_date"
                  type="date"
                  value={values?.transaction_date?.toString().split('T')[0]}
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
}

export default AddTransactionBtn;