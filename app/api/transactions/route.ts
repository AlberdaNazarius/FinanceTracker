import { NextResponse } from "next/server";
import {
  getSupabase,
  getSupabaseUser,
  jsonError,
  handleApiError,
} from "@/helpers/server-utils";

export async function GET() {
  try {
    const supabase = await getSupabase();

    const {data, error} = await supabase
      .from("transaction")
      .select(`
        *,
        category:category_id (*),
        currency:currency_id (*)
      `)
      .order("transaction_date", {ascending: false});

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

    const {data, error} = await supabase
      .from("transaction")
      .insert({
        ...body,
        user_id: user.id
      })
      .select()
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
