import {SupabaseClient} from "@supabase/supabase-js";

/** Supabase returns the join table nested; callers want a flat tag list. */
export const flattenTags = <T extends Record<string, unknown>>(row: T): T => {
  const nested = row?.tags as {tag: unknown}[] | undefined;

  if (!Array.isArray(nested)) return row;

  return {...row, tags: nested.map((entry) => entry.tag).filter(Boolean)};
}

export const flattenTagsAll = <T extends Record<string, unknown>>(rows: T[]): T[] =>
  rows.map(flattenTags);

/** Replaces the tag links of a transaction with exactly `tagIds`. */
export const syncTransactionTags = async (
  supabase: SupabaseClient,
  transactionId: string,
  tagIds: string[],
): Promise<void> => {
  await supabase.from("transaction_tag").delete().eq("transaction_id", transactionId);

  if (tagIds.length === 0) return;

  await supabase.from("transaction_tag").insert(
    [...new Set(tagIds)].map((tagId) => ({
      transaction_id: transactionId,
      tag_id: tagId,
    })),
  );
}
