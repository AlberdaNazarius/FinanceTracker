"use client"

import React, {useMemo, useState} from "react"
import {Dialog, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {expenseCategories, incomeCategories} from "@/helpers/data";
import {TransactionType} from "@/enum/TransactionType";

const AddTransactionBtn: React.FC = () => {
  const formInitState = {
    amount: "",
    type: TransactionType.EXPENSE,
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  }

  const [formData, setFormData] = useState(formInitState)

  const categories = useMemo(
    () => (formData.type === TransactionType.EXPENSE ? expenseCategories : incomeCategories),
    [formData.type]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormData(formInitState)
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
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({...formData, type: value})}
              required
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select a type"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({...formData, category: value})}
              required
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category"/>
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
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
      </DialogContent>
    </Dialog>
  );
}

export default AddTransactionBtn;