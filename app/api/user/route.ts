import { NextResponse } from "next/server";
import { createClient } from "@/helpers/supabase/server";
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user")
      .select(`
        username,
        balance,
        preferred_currency:preferred_currency_id (*)
      `)
      .eq("id", authUser.id)
      .single();

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}