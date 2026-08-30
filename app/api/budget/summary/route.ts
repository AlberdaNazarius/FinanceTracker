import {getSupabaseUser, jsonError, handleApiError} from "@/helpers/server-utils";
import {NextResponse} from "next/server";

type SummaryRow = {
  budgetId: string;
  budget: number;
  category: string;
  categoryColor: string;
  categoryIcon: string;
  spent: number;
  unconverted: number;
};

export async function GET() {
  try {
    const {supabase, user} = await getSupabaseUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    // spent already arrives in the user's preferred currency, converted at the
    // rate of each transaction's own date.
    const {data, error} = await supabase
      .from("budget_summary")
      .select(`
        budgetId:budget_id,
        budget,
        category,
        categoryColor:category_color,
        categoryIcon:category_icon,
        spent,
        unconverted
      `)
      .eq("user_id", user.id);

    if (error) {
      return jsonError(error.message, 400);
    }

    const rows = (data ?? []) as unknown as SummaryRow[];
    let ratesAvailable = true;

    const summary = rows.map((row) => {
      if (Number(row.unconverted) > 0) ratesAvailable = false;

      const budget = Number(row.budget) || 0;
      const spent = Number(row.spent) || 0;

      return {
        budgetId: row.budgetId,
        budget,
        category: row.category,
        categoryColor: row.categoryColor,
        categoryIcon: row.categoryIcon,
        spent,
        remaining: budget - spent,
        usedPercentage: budget > 0 ? Math.round((spent / budget) * 10000) / 100 : 0,
      };
    });

    return NextResponse.json({data: summary, ratesAvailable}, {status: 200});
  } catch (error) {
    return handleApiError(error, "GET /budget/summary");
  }
}
