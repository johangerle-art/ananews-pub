/**
 * API: Hämtar och analyserar nyheter
 * GET /api/news
 */

import { NextResponse } from "next/server";
import { getNewsData } from "@/lib/news";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getNewsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API-fel:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta nyheter" },
      { status: 500 }
    );
  }
}
