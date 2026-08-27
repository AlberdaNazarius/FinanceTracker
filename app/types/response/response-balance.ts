import {LocationBalance} from "@/types/location-balance";

export type ResponseBalance = {
  /** null when no exchange rate was available to normalise mixed currencies. */
  total: number | null;
  currency: string;
  locations: LocationBalance[];
  ratesAvailable: boolean;
}
