import axios from "axios";
import {ApiRoutes} from "@/enum/api-routes";
import {ExchangeRates} from "@/types/exchange-rates";

const getRates = async (base: string): Promise<ExchangeRates | null> => {
  const response = await axios.get(ApiRoutes.EXCHANGE_RATES, {params: {base}});
  return response.data?.data ?? null;
}

export const ExchangeRateService = {
  getRates
}
