/**
 * Schemalagd uppdatering – Vercel Cron
 * Kör varje dag kl 05:00 UTC (07:00 svensk tid)
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  // Verifiera att anropet kommer från Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/news`);
    const data = await res.json();

    return NextResponse.json({
      success: true,
      newsCount: data.news?.length ?? 0,
    });
  } catch (error) {
    console.error("Cron-fel:", error);
    return NextResponse.json(
      { error: "Cron misslyckades" },
      { status: 500 }
    );
  }
}
