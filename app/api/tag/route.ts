import {NextResponse} from "next/server";
import {getSupabaseUser, jsonError, handleApiError} from "@/helpers/server-utils";

export async function GET() {
  try {
    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const {data, error} = await supabase
      .from("tag")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name", {ascending: true});

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({data}, {status: 200});
  } catch (error) {
    return handleApiError(error, "GET /tag");
  }
}

/**
 * Tags are created as they are typed, so this resolves names to rows and
 * returns every requested tag whether it already existed or not.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const names: string[] = Array.isArray(body?.names) ? body.names : [];

    const cleaned = [
      ...new Set(
        names
          .map((name) => String(name).trim().replace(/^#/, ""))
          .filter(Boolean)
          .map((name) => name.slice(0, 40)),
      ),
    ];

    if (cleaned.length === 0) {
      return jsonError("names is required", 400);
    }

    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const {data: existing} = await supabase
      .from("tag")
      .select("id, name")
      .eq("user_id", user.id);

    const byLowerName = new Map(
      (existing ?? []).map((tag) => [tag.name.toLowerCase(), tag]),
    );

    const missing = cleaned.filter((name) => !byLowerName.has(name.toLowerCase()));

    if (missing.length > 0) {
      const {data: created, error} = await supabase
        .from("tag")
        .insert(missing.map((name) => ({name, user_id: user.id})))
        .select("id, name");

      if (error) {
        return jsonError(error.message, 400);
      }

      for (const tag of created ?? []) {
        byLowerName.set(tag.name.toLowerCase(), tag);
      }
    }

    const data = cleaned
      .map((name) => byLowerName.get(name.toLowerCase()))
      .filter(Boolean);

    return NextResponse.json({data}, {status: 200});
  } catch (error) {
    return handleApiError(error, "POST /tag", "Invalid request body");
  }
}
