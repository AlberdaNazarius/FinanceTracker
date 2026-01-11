import {getSupabaseUser, jsonError} from "@/helpers/server-utils";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("budget_summary")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Budget summary fetch error:", error);
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /budget error:", error);
    return jsonError("Unexpected server error", 500);
  }
}