import {getSupabaseUser, jsonError} from "@/helpers/server-utils";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("budget")
      .select(`
        id,
        amount,
        periodStart:period_start,
        periodEnd:period_end,
        createdAt:created_at,
        updatedAt:updated_at,
        category:category_id (
          id,
          name,
          type,
          color,
          icon
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Budget fetch error:", error);
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (error) {
    console.error("GET /budget error:", error);
    return jsonError("Unexpected server error", 500);
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
      .from("budget")
      .insert({
        ...body,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Budget create error:", error);
      return jsonError(error.message, 400);
    }

    return NextResponse.json({data}, {status: 201});
  } catch (error) {
    console.error("POST /budget error:", error);
    return jsonError("Invalid request body", 400);
  }
}