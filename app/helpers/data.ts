import {Transaction} from "@/types/Transaction";
import {TransactionType} from "@/enum/TransactionType";

export const TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    type: TransactionType.EXPENSE,
    description: 'Grocery Shopping',
    category: {
      name: 'Food',
      description: 'Expenses for food and groceries',
    },
    date: new Date(),
    amount: 75.50,
    currency: 'USD',
  },
  {
    id: 2,
    type: TransactionType.EXPENSE,
    description: 'Electricity Bill',
    category: {
      name: 'Bills',
      description: 'Monthly utility bills',
    },
    date: new Date(),
    amount: 120.00,
    currency: 'USD',
  },
  {
    id: 3,
    type: TransactionType.EXPENSE,
    description: 'Gym Membership',
    category: {
      name: 'Healthcare',
      description: 'Health and fitness expenses',
    },
    date: new Date(),
    amount: 45.00,
    currency: 'USD',
  },
];

export let incomeCategories: string[] = ["Salary", "Freelance", "Investment", "Gift", "Other"]
export let expenseCategories: string[] = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Healthcare", "Other"]