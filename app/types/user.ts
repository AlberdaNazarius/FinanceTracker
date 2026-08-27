import {Currency} from "@/types/currency";
import {DashboardSettings} from "@/types/dashboard-settings";

export type User = {
  username: string;
  preferredCurrency: Currency;
  dashboardSettings: DashboardSettings;
}