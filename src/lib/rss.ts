/**
 * RSS-inhämtning
 * Om en källa failar, fortsätt med övriga
 */

import Parser from "rss-parser";
import type { RawFeedItem } from "@/types/news";
import { regions } from "./regions";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Ananews/1.0 (https://ananews.pub; anarkistisk nyhetsaggregator)",
  },
});

export interface FeedItemWithRegion extends RawFeedItem {
  regionId: string;
  regionName: string;
  sourceUrl: string;
}

/**
 * Hämtar alla nyheter från alla regioner
 * Fel hanteras mjukt – misslyckade källor hoppas över
 */
export async function fetchAllFeeds(): Promise<FeedItemWithRegion[]> {
  const results: FeedItemWithRegion[] = [];

  for (const region of regions) {
    for (const url of region.rssUrls) {
      try {
        const feed = await parser.parseURL(url);
        const items = feed.items ?? [];

        for (const item of items) {
          if (item.title && item.link) {
            results.push({
              title: item.title,
              link: item.link,
              content: item.content,
              contentSnippet: item.contentSnippet,
              pubDate: item.pubDate,
              isoDate: item.isoDate,
              regionId: region.id,
              regionName: region.name,
              sourceUrl: url,
            });
          }
        }
      } catch (error) {
        console.warn(`RSS-fel för ${url}:`, error);
        // Fortsätt med nästa källa
      }
    }
  }

  return results;
}
