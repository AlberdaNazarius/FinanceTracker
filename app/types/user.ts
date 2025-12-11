import {Currency} from "@/types/currency";

export type User = {
  username: string;
  balance: number;
  preferred_currency: Currency;
}