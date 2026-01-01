import {NextRequest, NextResponse} from "next/server";
import {getSupabaseUser, jsonError} from "@/helpers/server-utils";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
){
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonError("Category ID is required", 400);
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
      .from("category")
      .update(body)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error("Category update error:", error);
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Category not found or access denied", 404);
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    console.error("PUT /category error:", error);
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
      return jsonError("Category ID is required", 400);
    }

    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("category")
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error("Category delete error:", error);
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Category not found or access denied", 404);
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    console.error("DELETE /category error:", error);
    return jsonError("Unexpected server error", 500);
  }
}