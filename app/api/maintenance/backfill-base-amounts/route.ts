import {NextResponse} from "next/server";
import {getSupabaseUser, jsonError, handleApiError} from "@/helpers/server-utils";
import {getRatesForDate, toBaseAmount} from "@/helpers/server/daily-rates";
import {CURRENCIES} from "@/helpers/constants";

export async function POST() {
  try {
    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const {data: rows, error} = await supabase
      .from("transaction")
      .select("id, amount, currency_id, transaction_date")
      .eq("user_id", user.id)
      .is("amount_base", null);

    if (error) {
      return jsonError(error.message, 400);
    }

    if (!rows?.length) {
      return NextResponse.json({data: {updated: 0, skipped: 0}}, {status: 200});
    }

    // One rate lookup per distinct day rather than per row.
    const byDate = new Map<string, typeof rows>();
    for (const row of rows) {
      const day = String(row.transaction_date).split("T")[0];
      byDate.set(day, [...(byDate.get(day) ?? []), row]);
    }

    let updated = 0;
    let skipped = 0;

    for (const [day, dayRows] of byDate) {
      const rates = await getRatesForDate(supabase, day);

      for (const row of dayRows) {
        const code = CURRENCIES.find((currency) => currency.id === row.currency_id)?.code;
        const amountBase = code ? toBaseAmount(Number(row.amount), code, rates) : null;

        if (amountBase === null) {
          skipped++;
          continue;
        }

        await supabase
          .from("transaction")
          .update({amount_base: amountBase})
          .eq("id", row.id)
          .eq("user_id", user.id);

        updated++;
      }
    }

    return NextResponse.json({data: {updated, skipped}}, {status: 200});
  } catch (error) {
    return handleApiError(error, "POST /maintenance/backfill-base-amounts");
  }
}
