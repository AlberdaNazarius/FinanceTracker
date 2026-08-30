import {NextResponse} from "next/server";
import {getSupabaseUser, jsonError, handleApiError} from "@/helpers/server-utils";
import {TRANSFER_SELECT} from "@/helpers/query-selects";

export async function GET() {
  try {
    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const {data, error} = await supabase
      .from("transfer")
      .select(TRANSFER_SELECT)
      .eq("user_id", user.id)
      .order("transfer_date", {ascending: false})
      .order("created_at", {ascending: false});

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({data}, {status: 200});
  } catch (error) {
    return handleApiError(error, "GET /transfer");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return jsonError("Request body is empty", 400);
    }

    if (body.from_location_id === body.to_location_id) {
      return jsonError("Source and destination must be different locations", 400);
    }

    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const {data, error} = await supabase
      .from("transfer")
      .insert({
        ...body,
        fee_amount: body.fee_amount ?? 0,
        user_id: user.id,
      })
      .select(TRANSFER_SELECT)
      .single();

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({data}, {status: 201});
  } catch (error) {
    return handleApiError(error, "POST /transfer", "Invalid request body");
  }
}
