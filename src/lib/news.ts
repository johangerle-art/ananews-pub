/**
 * Delad logik för nyhetshämtning
 * Används av både API-route och server components
 */

import { fetchAllFeeds } from "./rss";
import { analyzeNewsItem } from "./analyze";
import { getActiveRegionsForHour } from "./regions";
import type { NewsItem } from "@/types/news";

export interface NewsData {
  news: NewsItem[];
  activeRegions: string[];
  analyzed: boolean;
}

export async function getNewsData(): Promise<NewsData> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const useAnalysis = Boolean(apiKey);

  const feedItems = await fetchAllFeeds();
  const itemsToProcess = feedItems.slice(0, useAnalysis ? 15 : 50);

  let newsItems: NewsItem[] = [];

  if (useAnalysis) {
    const analyzed = await Promise.all(
      itemsToProcess.map((item) => analyzeNewsItem(item, apiKey!))
    );
    newsItems = analyzed.filter((n): n is NewsItem => n !== null);
  } else {
    newsItems = itemsToProcess.map((item, i) => ({
      id: `news-${Date.now()}-${i}`,
      title: item.title ?? "Okänd rubrik",
      summary: item.contentSnippet?.slice(0, 120) ?? "",
      category: "GLOBAL" as const,
      powerAnalysis: "",
      sourceUrl: item.link ?? "",
      sourceName: (() => {
        try {
          return new URL(item.sourceUrl).hostname;
        } catch {
          return "okänd";
        }
      })(),
      region: item.regionName,
      regionId: item.regionId,
      publishedAt: item.isoDate ?? item.pubDate,
    }));
  }

  const now = new Date();
  const swedishHour = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Stockholm" })
  ).getHours();
  const activeRegions = getActiveRegionsForHour(swedishHour);

  newsItems.sort((a, b) => {
    const aActive = activeRegions.includes(a.regionId);
    const bActive = activeRegions.includes(b.regionId);
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return 0;
  });

  return {
    news: newsItems,
    activeRegions,
    analyzed: useAnalysis,
  };
}
