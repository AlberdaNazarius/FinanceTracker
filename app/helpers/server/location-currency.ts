import {SupabaseClient} from "@supabase/supabase-js";

/**
 * A transaction's currency is not chosen by the client — it is whatever the
 * money location holds. Returns null when the location is not the user's.
 */
export const resolveLocationCurrency = async (
  supabase: SupabaseClient,
  userId: string,
  locationId: string,
): Promise<number | null> => {
  const {data} = await supabase
    .from("money_location")
    .select("currency_id")
    .eq("id", locationId)
    .eq("user_id", userId)
    .single();

  return data?.currency_id ?? null;
}
