import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseUser,
  jsonError,
  handleApiError,
} from "@/helpers/server-utils";

export async function GET() {
  try {
    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("user")
      .select(`
        username,
        balance,
        preferredCurrency:preferred_currency_id (*)
      `)
      .eq("id", user.id)
      .single();

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "GET /user");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const body = await req.json();
    const preferredCurrencyId = body?.preferred_currency_id;

    if (!preferredCurrencyId) {
      return jsonError("preferred_currency_id is required", 400);
    }

    const { data, error } = await supabase
      .from("user")
      .update({ preferred_currency_id: preferredCurrencyId })
      .eq("id", user.id)
      .select(`
        username,
        preferredCurrency:preferred_currency_id (*)
      `)
      .single();

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "PATCH /user");
  }
}