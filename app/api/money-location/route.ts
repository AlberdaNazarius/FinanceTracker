import {NextResponse} from "next/server";
import {getSupabaseUser, jsonError, handleApiError} from "@/helpers/server-utils";
import {MONEY_LOCATION_SELECT as SELECT} from "@/helpers/query-selects";

export async function GET() {
  try {
    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const {data, error} = await supabase
      .from("money_location")
      .select(SELECT)
      .eq("user_id", user.id)
      .order("sort_order", {ascending: true})
      .order("name", {ascending: true});

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({data}, {status: 200});
  } catch (error) {
    return handleApiError(error, "GET /money-location");
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

    const {count} = await supabase
      .from("money_location")
      .select("id", {count: "exact", head: true})
      .eq("user_id", user.id);

    // The very first location is the default whether or not it was asked for.
    const isDefault = !!body.is_default || count === 0;

    // Only one location may be the default, so clear the previous one first.
    if (isDefault) {
      await supabase
        .from("money_location")
        .update({is_default: false})
        .eq("user_id", user.id);
    }

    const {data, error} = await supabase
      .from("money_location")
      .insert({
        ...body,
        user_id: user.id,
        is_default: isDefault,
      })
      .select(SELECT)
      .single();

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({data}, {status: 201});
  } catch (error) {
    return handleApiError(error, "POST /money-location", "Invalid request body");
  }
}
