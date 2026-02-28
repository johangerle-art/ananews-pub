/**
 * Ett nyhetskort
 * Mobilfirst, min touch-target 44px
 */

import type { NewsItem } from "@/types/news";
import RegionBadge from "./RegionBadge";

const CATEGORY_COLORS: Record<string, string> = {
  MOTSTÅND: "#22c55e",
  ÖVERVAKNING: "#ef4444",
  KLIMAT: "#84cc16",
  EKONOMI: "#f59e0b",
  GLOBAL: "#3b82f6",
};

interface NewsCardProps {
  item: NewsItem;
  isRegionActive?: boolean;
}

export default function NewsCard({ item, isRegionActive }: NewsCardProps) {
  const accentColor = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.GLOBAL;

  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block min-h-[44px] rounded-lg border border-[#1a1a1a] bg-[#0f0f0f] p-4 transition-colors hover:border-[#2a2a2a] active:bg-[#141414]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <RegionBadge region={item.region} isActive={isRegionActive} />
        <span
          className="text-xs font-medium"
          style={{ color: accentColor }}
        >
          {item.category}
        </span>
      </div>
      <h3 className="mt-2 text-base font-semibold text-[#e8e8e8] line-clamp-2">
        {item.title}
      </h3>
      {item.summary && (
        <p className="mt-1.5 text-sm leading-relaxed text-[#a0a0a0] line-clamp-2">
          {item.summary}
        </p>
      )}
      {item.powerAnalysis && (
        <p className="mt-2 text-xs italic text-[#6b6b6b]">
          {item.powerAnalysis}
        </p>
      )}
    </a>
  );
}
