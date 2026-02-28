/**
 * Claude API-analys – anarkistisk nyhetsanalys inspirerad av Joseph Toscano
 */

import Anthropic from "@anthropic-ai/sdk";
import type { NewsCategory, NewsItem } from "@/types/news";
import type { FeedItemWithRegion } from "./rss";

const SYSTEM_PROMPT = `Du är en anarkistisk nyhetsanalytiker inspirerad av Joseph Toscano.
Analysera nyheten genom dessa linser:
1. Vem utövar makt i denna händelse?
2. Vem utmanar makten?
3. Finns decentraliserade eller självorganiserade initiativ?
4. Hur påverkas individens autonomi?
5. Finns övervakning, kontroll eller hierarkiska strukturer?

Generera:
- En kort, skarp rubrik (max 10 ord) på svenska
- En sammanfattning (max 40 ord) på svenska
- En kategori: [MOTSTÅND | ÖVERVAKNING | KLIMAT | EKONOMI | GLOBAL]
- En maktanalys (en mening): vem mot vem

Svara ENDAST med JSON i formatet:
{"title":"...","summary":"...","category":"MOTSTÅND|ÖVERVAKNING|KLIMAT|EKONOMI|GLOBAL","powerAnalysis":"..."}`;

const VALID_CATEGORIES: NewsCategory[] = [
  "MOTSTÅND",
  "ÖVERVAKNING",
  "KLIMAT",
  "EKONOMI",
  "GLOBAL",
];

function parseAnalysisResponse(
  text: string
): {
  title: string;
  summary: string;
  category: NewsCategory;
  powerAnalysis: string;
} | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as {
      title?: string;
      summary?: string;
      category?: string;
      powerAnalysis?: string;
    };

    const category = VALID_CATEGORIES.includes(parsed.category as NewsCategory)
      ? (parsed.category as NewsCategory)
      : "GLOBAL";

    return {
      title: parsed.title ?? "Okänd rubrik",
      summary: parsed.summary ?? "",
      category,
      powerAnalysis: parsed.powerAnalysis ?? "",
    };
  } catch {
    return null;
  }
}

export async function analyzeNewsItem(
  item: FeedItemWithRegion,
  apiKey: string
): Promise<NewsItem | null> {
  const anthropic = new Anthropic({ apiKey });

  const content = [item.contentSnippet, item.content].filter(Boolean).join("\n");
  const textToAnalyze = `${item.title}\n\n${content}`.slice(0, 4000);

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: textToAnalyze,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") return null;

    const analysis = parseAnalysisResponse(textContent.text);
    if (!analysis) return null;

    return {
      id: `news-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: analysis.title,
      summary: analysis.summary,
      category: analysis.category,
      powerAnalysis: analysis.powerAnalysis,
      sourceUrl: item.link ?? "",
      sourceName: new URL(item.sourceUrl).hostname,
      region: item.regionName,
      regionId: item.regionId,
      publishedAt: item.isoDate ?? item.pubDate,
    };
  } catch (error) {
    console.warn("Claude-analysfel:", error);
    return null;
  }
}
