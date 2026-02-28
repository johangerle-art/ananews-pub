/**
 * Startsida / morgonöversikt
 */

import Header from "@/components/Header";
import NewsSection from "@/components/NewsSection";
import { getNewsData } from "@/lib/news";

const SECTION_CONFIG = [
  { id: "headlines", title: "Globala huvudrubriker", categories: ["GLOBAL"] },
  { id: "motstand", title: "Motstånd & självorganisering", categories: ["MOTSTÅND"] },
  { id: "overvakning", title: "Övervakning & kontroll", categories: ["ÖVERVAKNING"] },
  { id: "klimat", title: "Klimat & ekologi", categories: ["KLIMAT"] },
  { id: "ekonomi", title: "Ekonomi underifrån", categories: ["EKONOMI"] },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  let news: Awaited<ReturnType<typeof getNewsData>>["news"] = [];
  let activeRegions: string[] = [];

  try {
    const data = await getNewsData();
    news = data.news;
    activeRegions = data.activeRegions;
  } catch (error) {
    console.error(error);
  }

  // Globala huvudrubriker: första 5
  const headlines = news.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-[#e8e8e8]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6 pb-16">
        <NewsSection
          title="Globala huvudrubriker"
          items={headlines}
          activeRegionIds={activeRegions}
        />
        {SECTION_CONFIG.slice(1).map((section) => {
          const items = news.filter((item) =>
            section.categories.includes(item.category)
          );
          return (
            <div key={section.id} className="mt-8">
              <NewsSection
                title={section.title}
                items={items}
                activeRegionIds={activeRegions}
              />
            </div>
          );
        })}
        {news.length === 0 && (
          <p className="py-12 text-center text-[#6b6b6b]">
            Laddar nyheter... Om detta visas länge, kontrollera att API:et
            svarar.
          </p>
        )}
      </main>
    </div>
  );
}
