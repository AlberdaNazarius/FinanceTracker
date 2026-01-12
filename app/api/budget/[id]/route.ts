import {NextRequest, NextResponse} from "next/server";
import {getSupabaseUser, jsonError} from "@/helpers/server-utils";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonError("Budget ID is required", 400);
    }

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
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Budget fetch error:", error);
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    console.error("GET /budget/id error:", error);
    return jsonError("Unexpected server error", 500);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
){
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonError("Budget ID is required", 400);
    }

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return jsonError("Update payload is empty", 400);
    }

    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("budget")
      .update(body)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error("Budget update error:", error);
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Budget not found or access denied", 404);
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    console.error("PUT /budget error:", error);
    return jsonError("Invalid request body or unexpected error", 400);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonError("Budget ID is required", 400);
    }

    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("budget")
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error("Budget delete error:", error);
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Budget not found or access denied", 404);
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    console.error("DELETE /budget error:", error);
    return jsonError("Unexpected server error", 500);
  }
}