import { NextResponse } from 'next/server';
import {getSupabase, getSupabaseUser, jsonError} from "@/helpers/server-utils";

export async function GET() {
  try {
    const supabase = await getSupabase();

    const { data, error } = await supabase
      .from("category")
      .select(`
        id,
        name,
        type,
        color,
        icon
      `)
      .order("name", { ascending: false });

    if (error) {
      console.error("Category fetch error:", error);
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /category error:", error);
    return jsonError("Unexpected server error", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return jsonError("Request body is empty", 400);
    }

    const { supabase, user } = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { data, error } = await supabase
      .from("category")
      .insert({
        ...body,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Category create error:", error);
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST /category error:", error);
    return jsonError("Invalid request body", 400);
  }
}
