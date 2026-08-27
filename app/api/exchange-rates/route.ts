import {NextRequest, NextResponse} from "next/server";
import {handleApiError} from "@/helpers/server-utils";
import {fetchExchangeRates} from "@/helpers/server/exchange-rates";
import {DEFAULT_CURRENCY} from "@/helpers/constants";

export async function GET(req: NextRequest) {
  try {
    const base = req.nextUrl.searchParams.get("base") ?? DEFAULT_CURRENCY.code;
    const rates = await fetchExchangeRates(base);

    return NextResponse.json({data: rates}, {status: 200});
  } catch (error) {
    return handleApiError(error, "GET /exchange-rates");
  }
}
