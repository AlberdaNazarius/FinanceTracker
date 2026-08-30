import {NextRequest, NextResponse} from "next/server";
import {getSupabaseUser, jsonError} from "@/helpers/server-utils";
import {TRANSACTION_SELECT} from "@/helpers/query-selects";
import {flattenTags, syncTransactionTags} from "@/helpers/server/transaction-tags";
import {resolveLocationCurrency} from "@/helpers/server/location-currency";
import {getRatesForDate, toBaseAmount} from "@/helpers/server/daily-rates";
import {CURRENCIES} from "@/helpers/constants";

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

    const tagIds: string[] | undefined = body.tag_ids;
    delete body.tag_ids;

    if (body.location_id) {
      const currencyId = await resolveLocationCurrency(
        supabase,
        user.id,
        body.location_id
      );

      if (!currencyId) {
        return jsonError("Location not found or access denied", 400);
      }

      body.currency_id = currencyId;
    }

    if (body.amount !== undefined || body.transaction_date || body.location_id) {
      const {data: existing} = await supabase
        .from("transaction")
        .select("amount, currency_id, transaction_date")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      const currencyId = body.currency_id ?? existing?.currency_id;
      const code = CURRENCIES.find((currency) => currency.id === currencyId)?.code;
      const rates = await getRatesForDate(
        supabase,
        body.transaction_date ?? existing?.transaction_date
      );

      body.amount_base = code
        ? toBaseAmount(Number(body.amount ?? existing?.amount), code, rates)
        : null;
    }

    const { data, error } = await supabase
      .from("transaction")
      .update(body)
      .eq('id', id)
      .eq('user_id', user.id)
      .select(TRANSACTION_SELECT)
      .single();

    if (error) {
      console.error("Transaction update error:", error);
      return jsonError(error.message, 400);
    }

    if (!data) {
      return jsonError("Transaction not found or access denied", 404);
    }

    if (tagIds) {
      await syncTransactionTags(supabase, id, tagIds);
    }

    return NextResponse.json({ data: flattenTags(data) }, { status: 200 });
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