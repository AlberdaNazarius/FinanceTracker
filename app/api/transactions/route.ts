import { NextResponse } from "next/server";
import {
  getSupabase,
  getSupabaseUser,
  jsonError,
  handleApiError,
} from "@/helpers/server-utils";
import { TRANSACTION_SELECT } from "@/helpers/query-selects";
import { resolveLocationCurrency } from "@/helpers/server/location-currency";
import { getRatesForDate, toBaseAmount } from "@/helpers/server/daily-rates";
import { CURRENCIES } from "@/helpers/constants";

export async function GET() {
  try {
    const supabase = await getSupabase();

    const {data, error} = await supabase
      .from("transaction")
      .select(TRANSACTION_SELECT)
      .order("transaction_date", {ascending: false})
      .order("created_at", {ascending: false});

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "GET /transactions");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return jsonError("Request body is empty", 400);
    }

    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    if (!body.location_id) {
      return jsonError("location_id is required", 400);
    }

    const currencyId = await resolveLocationCurrency(
      supabase,
      user.id,
      body.location_id
    );

    if (!currencyId) {
      return jsonError("Location not found or access denied", 400);
    }

    // Normalise at the rate of the transaction's own date so past reports stay put.
    const code = CURRENCIES.find((currency) => currency.id === currencyId)?.code;
    const rates = await getRatesForDate(supabase, body.transaction_date);
    const amountBase = code ? toBaseAmount(Number(body.amount), code, rates) : null;

    const {data, error} = await supabase
      .from("transaction")
      .insert({
        ...body,
        currency_id: currencyId,
        amount_base: amountBase,
        user_id: user.id
      })
      .select(TRANSACTION_SELECT)
      .single();

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleApiError(
      error,
      "POST /transactions",
      "Invalid request body"
    );
  }
}
