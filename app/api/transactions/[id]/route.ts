import {NextRequest, NextResponse} from "next/server";
import {getSupabaseUser, jsonError} from "@/helpers/server-utils";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
){
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonError("ID is required", 400);
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
      .from("transaction")
      .update(body)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error("Transaction update error:", error);
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Transaction not found or access denied", 404);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("PUT /transaction error:", error);
    return jsonError("Unexpected server error", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonError("ID is required", 400);
    }

    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("transaction")
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error("Transaction delete error:", error);
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Transaction not found or access denied", 404);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("DELETE /transaction error:", error);
    return jsonError("Unexpected server error", 500);
  }
}