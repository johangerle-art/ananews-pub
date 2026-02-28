/**
 * TypeScript-typer för ananews
 */

export type NewsCategory =
  | "MOTSTÅND"
  | "ÖVERVAKNING"
  | "KLIMAT"
  | "EKONOMI"
  | "GLOBAL";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  powerAnalysis: string;
  sourceUrl: string;
  sourceName: string;
  region: string;
  regionId: string;
  publishedAt?: string;
}

export interface RawFeedItem {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  isoDate?: string;
}

export interface Region {
  id: string;
  name: string;
  rssUrls: string[];
  timezone: string;
}
