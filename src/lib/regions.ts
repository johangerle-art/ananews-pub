/**
 * Regiondefinitioner och RSS-källor
 * Lätt att byta ut eller lägga till källor – ändra bara här
 */

import type { Region } from "@/types/news";

export const regions: Region[] = [
  {
    id: "europa",
    name: "Europa",
    timezone: "Europe/Stockholm",
    rssUrls: [
      "https://feeds.bbci.co.uk/news/world/europe/rss.xml",
      "https://rss.dw.com/rdf/rss-en-all",
    ],
  },
  {
    id: "nordamerika",
    name: "Nordamerika",
    timezone: "America/New_York",
    rssUrls: [
      "https://feeds.npr.org/1001/rss.xml",
      "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    ],
  },
  {
    id: "ostasien",
    name: "Östasien",
    timezone: "Asia/Tokyo",
    rssUrls: ["https://www3.nhk.or.jp/nhkworld/en/news/feeds/"],
  },
  {
    id: "sydostasien",
    name: "Sydostasien",
    timezone: "Asia/Bangkok",
    rssUrls: ["https://www.bangkokpost.com/rss/data/topstories.xml"],
  },
  {
    id: "sydasien",
    name: "Sydasien",
    timezone: "Asia/Kolkata",
    rssUrls: ["https://feeds.feedburner.com/ndtvnews-top-stories"],
  },
  {
    id: "afrika",
    name: "Afrika",
    timezone: "Africa/Johannesburg",
    rssUrls: [
      "https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf",
    ],
  },
  {
    id: "mellanostern",
    name: "Mellanöstern",
    timezone: "Asia/Dubai",
    rssUrls: ["https://www.aljazeera.com/xml/rss/all.xml"],
  },
  {
    id: "sydamerika",
    name: "Sydamerika",
    timezone: "America/Sao_Paulo",
    rssUrls: [
      "https://feeds.bbci.co.uk/news/world/latin_america/rss.xml",
    ],
  },
  {
    id: "oceanien",
    name: "Oceanien",
    timezone: "Australia/Sydney",
    rssUrls: ["https://www.abc.net.au/news/feed/51120/rss.xml"],
  },
];

/**
 * Tidszonlogik: prioritera regioner baserat på svensk tid (CET/CEST)
 * 00:00–08:00 → Östasien, Sydostasien, Oceanien
 * 06:00–18:00 → Europa, Afrika, Mellanöstern
 * 14:00–04:00 → Nordamerika, Sydamerika
 */
export function getActiveRegionsForHour(swedishHour: number): string[] {
  if (swedishHour >= 0 && swedishHour < 8) {
    return ["ostasien", "sydostasien", "oceanien"];
  }
  if (swedishHour >= 6 && swedishHour < 18) {
    return ["europa", "afrika", "mellanostern"];
  }
  return ["nordamerika", "sydamerika"];
}
