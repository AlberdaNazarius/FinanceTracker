import {cookies} from "next/headers";
import {createClient} from "@/helpers/supabase/server";
import {NextResponse} from "next/server";

export const getSupabase = async () => {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

export const getSupabaseUser = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

export const jsonError = (message: string, status = 400) => {
  return NextResponse.json({ error: message }, { status });
}