import {Transaction} from "@/types/Transaction";
import {TransactionType} from "@/enum/TransactionType";
import {Category} from "@/types/Category";

export const TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    type: TransactionType.EXPENSE,
    description: 'Grocery Shopping',
    category: {
      name: 'Food',
      description: 'Expenses for food and groceries',
    },
    transaction_date: new Date(),
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
    transaction_date: new Date(),
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
    transaction_date: new Date(),
    amount: 45.00,
    currency: 'USD',
  },
];

// export let incomeCategories: Category[] = [
//   {
//     name: "Salary",
//     description: "Monthly salary from employer",
//   },
//   {
//     name: "Freelancing",
//     description: "Income from freelance projects",
//   },
//   {
//     name: "Investments",
//     description: "Earnings from investments",
//   },
//   {
//     name: "Gifts",
//     description: "Monetary gifts received",
//   }
// ]
export let CATEGORIES: Category[] = [
  {
    name: "Income",
    description: "Sources of income",
  },
  {
    name: "Food",
    description: "Expenses for food and groceries",
  },
  {
    name: "Transportation",
    description: "Costs for public transport and fuel",
  },
  {
    name: "Utilities",
    description: "Monthly utility bills",
  },
  {
    name: "Entertainment",
    description: "Expenses for movies, events, etc.",
  }
]