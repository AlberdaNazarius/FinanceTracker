import {Currency} from "@/types/currency";

export type MoneyLocation = {
  id: string;
  name: string;
  currency: Currency;
  icon: string;
  color: string;
  is_default: boolean;
  archived: boolean;
  sort_order: number;
}

export type MoneyLocationRequest = {
  name: string;
  currency_id: number;
  icon: string;
  color: string;
  is_default?: boolean;
  archived?: boolean;
}
