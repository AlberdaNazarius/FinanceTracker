import {TransactionCategory} from "@/enum/TransactionCategory";

export const TRANSACTIONS = [
  {
    id: 1,
    description: 'Grocery Shopping',
    category: TransactionCategory.HEALTH,
    date: '2024-06-01',
    amount: 75.50,
  },
  {
    id: 2,
    description: 'Electricity Bill',
    category: TransactionCategory.HEALTH,
    date: '2024-06-03',
    amount: 120.00,
  },
  {
    id: 3,
    description: 'Gym Membership',
    category: TransactionCategory.SPORT,
    date: '2024-06-05',
    amount: 45.00,
  },
];