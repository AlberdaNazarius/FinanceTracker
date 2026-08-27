import {NextResponse} from "next/server";
import {getSupabaseUser, jsonError, handleApiError} from "@/helpers/server-utils";
import {DEFAULT_CURRENCY} from "@/helpers/constants";
import {sumInCurrency} from "@/helpers/exchange";
import {fetchExchangeRates} from "@/helpers/server/exchange-rates";
import {LocationBalance} from "@/types/location-balance";

export async function GET() {
  try {
    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const [balancesResult, profileResult] = await Promise.all([
      supabase
        .from("location_balance")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order", {ascending: true})
        .order("name", {ascending: true}),
      supabase
        .from("user")
        .select("preferredCurrency:preferred_currency_id (code)")
        .eq("id", user.id)
        .single(),
    ]);

    if (balancesResult.error) {
      return jsonError(balancesResult.error.message, 400);
    }

    const preferred = profileResult.data?.preferredCurrency as
      | {code: string}
      | {code: string}[]
      | null
      | undefined;
    const currency =
      (Array.isArray(preferred) ? preferred[0]?.code : preferred?.code) ??
      DEFAULT_CURRENCY.code;

    const locations = (balancesResult.data ?? []).map((row) => ({
      ...row,
      balance: Number(row.balance) || 0,
    })) as LocationBalance[];

    const active = locations.filter((location) => !location.archived);
    const needsConversion = active.some(
      (location) => location.currency_code !== currency,
    );

    const rates = needsConversion ? await fetchExchangeRates(currency) : null;
    const total = sumInCurrency(active, currency, rates);

    return NextResponse.json(
      {
        data: {
          total,
          currency,
          locations,
          ratesAvailable: !needsConversion || rates !== null,
        },
      },
      {status: 200},
    );
  } catch (error) {
    return handleApiError(error, "GET /user/balance");
  }
}
