import {NextRequest, NextResponse} from "next/server";
import {getSupabaseUser, jsonError, handleApiError} from "@/helpers/server-utils";
import {MONEY_LOCATION_SELECT as SELECT} from "@/helpers/query-selects";

// Postgres foreign-key violation — the location still has transactions or transfers.
const FK_VIOLATION = "23503";

export async function PUT(
  req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await context.params;

    if (!id) {
      return jsonError("Location ID is required", 400);
    }

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return jsonError("Update payload is empty", 400);
    }

    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    if (body.archived) {
      const {data: current} = await supabase
        .from("location_balance")
        .select("balance, currency_code")
        .eq("location_id", id)
        .eq("user_id", user.id)
        .single();

      if (current && Number(current.balance) !== 0) {
        return jsonError(
          `This location still holds ${current.balance} ${current.currency_code}. Transfer it out before archiving.`,
          409
        );
      }
    }

    // Only one location may be the default, so clear the previous one first.
    if (body.is_default) {
      await supabase
        .from("money_location")
        .update({is_default: false})
        .eq("user_id", user.id)
        .neq("id", id);
    }

    const {data, error} = await supabase
      .from("money_location")
      .update(body)
      .eq("id", id)
      .eq("user_id", user.id)
      .select(SELECT)
      .single();

    if (error) {
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Location not found or access denied", 404);
    }

    // The currency of a location is the currency of everything sitting in it.
    if (body.currency_id) {
      await supabase
        .from("transaction")
        .update({currency_id: body.currency_id})
        .eq("location_id", id)
        .eq("user_id", user.id);
    }

    return NextResponse.json({data}, {status: 200});
  } catch (error) {
    return handleApiError(error, "PUT /money-location", "Invalid request body");
  }
}

export async function DELETE(
  _req: NextRequest,
  context: {params: Promise<{id: string}>},
) {
  try {
    const {id} = await context.params;

    if (!id) {
      return jsonError("Location ID is required", 400);
    }

    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const {data, error} = await supabase
      .from("money_location")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .single();

    if (error) {
      if (error.code === FK_VIOLATION) {
        return jsonError(
          "This location still has operations attached. Archive it instead of deleting.",
          409,
        );
      }

      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Location not found or access denied", 404);
    }

    return NextResponse.json({data}, {status: 200});
  } catch (error) {
    return handleApiError(error, "DELETE /money-location");
  }
}
