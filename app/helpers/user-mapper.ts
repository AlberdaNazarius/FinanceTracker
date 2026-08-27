import {User} from "@/types/user";
import {Currency} from "@/types/currency";
import {DEFAULT_DASHBOARD_SETTINGS} from "@/types/dashboard-settings";

export const toUser = (row: Record<string, unknown> | null | undefined): User | null => {
  if (!row) return null;

  const preferred = row.preferredCurrency;

  return {
    username: row.username as string,
    preferredCurrency: (Array.isArray(preferred)
      ? preferred[0]
      : preferred) as Currency,
    dashboardSettings: {
      ...DEFAULT_DASHBOARD_SETTINGS,
      ...((row.dashboard_settings as object) ?? {}),
    },
  };
}
