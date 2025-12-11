import { createClient } from '@/helpers/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("transaction")
      .select(`
        *,
        category:category_id (*),
        currency:currency_id (*)
      `)
      .order("transaction_date", { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("transaction")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
