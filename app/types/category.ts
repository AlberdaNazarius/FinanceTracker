export type Category = {
  id: string;
  user_id?: number;
  name: string;
  description?: string;

  type?: 'income' | 'expense';
  color?: string
  icon?: string
}