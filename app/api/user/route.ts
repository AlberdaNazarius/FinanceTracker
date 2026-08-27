import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseUser,
  jsonError,
  handleApiError,
} from "@/helpers/server-utils";

const USER_SELECT = `
  username,
  dashboard_settings,
  preferredCurrency:preferred_currency_id (*)
`;

export async function GET() {
  try {
    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("user")
      .select(USER_SELECT)
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
    const update: Record<string, unknown> = {};

    if (body?.preferred_currency_id) {
      update.preferred_currency_id = body.preferred_currency_id;
    }

    if (body?.dashboard_settings) {
      update.dashboard_settings = body.dashboard_settings;
    }

    if (Object.keys(update).length === 0) {
      return jsonError(
        "preferred_currency_id or dashboard_settings is required",
        400
      );
    }

    const { data, error } = await supabase
      .from("user")
      .update(update)
      .eq("id", user.id)
      .select(USER_SELECT)
      .single();

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "PATCH /user");
  }
}
