import { NextResponse } from "next/server";
import {getSupabaseUser, jsonError} from "@/helpers/server-utils";

export async function GET() {
  try {
    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("user_balance")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("User balance fetch error:", error);
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /user_balance error:", error);
    return jsonError("Unexpected server error", 500);
  }
}