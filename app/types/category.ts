export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string
  icon: string
}

export type CategoryCreate = Omit<Category, 'id'>;