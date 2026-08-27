import {NextRequest, NextResponse} from "next/server";
import {getSupabaseUser, jsonError, handleApiError} from "@/helpers/server-utils";
import {TRANSFER_SELECT} from "@/helpers/query-selects";

export async function PUT(
  req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await context.params;

    if (!id) {
      return jsonError("Transfer ID is required", 400);
    }

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return jsonError("Update payload is empty", 400);
    }

    if (body.from_location_id && body.from_location_id === body.to_location_id) {
      return jsonError("Source and destination must be different locations", 400);
    }

    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const {data, error} = await supabase
      .from("transfer")
      .update(body)
      .eq("id", id)
      .eq("user_id", user.id)
      .select(TRANSFER_SELECT)
      .single();

    if (error) {
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Transfer not found or access denied", 404);
    }

    return NextResponse.json({data}, {status: 200});
  } catch (error) {
    return handleApiError(error, "PUT /transfer", "Invalid request body");
  }
}

export async function DELETE(
  _req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await context.params;

    if (!id) {
      return jsonError("Transfer ID is required", 400);
    }

    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const {data, error} = await supabase
      .from("transfer")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .single();

    if (error) {
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Transfer not found or access denied", 404);
    }

    return NextResponse.json({data}, {status: 200});
  } catch (error) {
    return handleApiError(error, "DELETE /transfer");
  }
}
