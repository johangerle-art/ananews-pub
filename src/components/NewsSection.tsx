/**
 * En nyhetssektion
 * Lätt att lägga till nya sektioner – bara ändra titel och filter
 */

import NewsCard from "./NewsCard";
import type { NewsItem } from "@/types/news";

interface NewsSectionProps {
  title: string;
  items: NewsItem[];
  activeRegionIds: string[];
}

export default function NewsSection({
  title,
  items,
  activeRegionIds,
}: NewsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-[#e8e8e8]">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            isRegionActive={activeRegionIds.includes(item.regionId)}
          />
        ))}
      </div>
    </section>
  );
}
