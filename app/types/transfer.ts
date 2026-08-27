import {MoneyLocation} from "@/types/money-location";

export type ResponseTransfer = {
  id: string;
  user_id?: string;
  from_location: MoneyLocation;
  to_location: MoneyLocation;
  from_amount: number;
  to_amount: number;
  fee_amount: number;
  description?: string;
  transfer_date: Date;
  created_at: Date;
}

export type RequestTransfer = {
  from_location_id: string;
  to_location_id: string;
  from_amount: number;
  to_amount: number;
  fee_amount: number;
  description?: string;
  transfer_date: Date;
}
