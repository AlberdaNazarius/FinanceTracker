import {cookies} from "next/headers";
import {createClient} from "@/helpers/supabase/server";
import {NextResponse} from "next/server";

export async function PUT(req: Request, {params}: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { id } = await params;
    const updateData = body;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required for updating" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("category")
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json(
        { error: "Category not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid request body or unexpected error" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request, {params}: { params: { id: string } }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required for deletion" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("category")
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json(
        { error: "Category not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid request or unexpected error" },
      { status: 400 }
    );
  }
}