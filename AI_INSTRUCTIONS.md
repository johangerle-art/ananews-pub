# AI_INSTRUCTIONS.md – ananews.pub
# Anarkistisk global morgonöversikt inspirerad av Joseph Toscano

## PROJEKTÖVERSIKT
Bygg en mobilfirst nyhetsöversikt med maktkritisk analys.
Domän: ananews.pub
Stack: Next.js (App Router) + Vercel + Claude API

---

## TECH STACK
- **Framework:** Next.js 14 med App Router
- **Hosting:** Vercel (gratis tier)
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Översättning:** MyMemory API (gratis, ingen nyckel krävs)
- **RSS-parsing:** rss-parser (npm-paket)
- **Schemaläggning:** Vercel Cron Jobs
- **Styling:** Tailwind CSS (mobilfirst)
- **Språk:** TypeScript

---

## FILSTRUKTUR
```
ananews/
├── app/
│   ├── page.tsx              # Startsida / morgonöversikt
│   ├── layout.tsx            # Global layout
│   ├── api/
│   │   ├── news/route.ts     # Hämtar och analyserar nyheter
│   │   └── cron/route.ts     # Schemalagd uppdatering
├── components/
│   ├── Header.tsx            # Sidhuvud
│   ├── NewsSection.tsx       # En nyhetssektion
│   ├── NewsCard.tsx          # Ett nyhetskort
│   └── RegionBadge.tsx       # Tidszon/region-indikator
├── lib/
│   ├── rss.ts                # RSS-inhämtning
│   ├── translate.ts          # Översättning via MyMemory
│   ├── analyze.ts            # Claude API-analys
│   └── regions.ts            # Regiondefinitioner och RSS-källor
├── types/
│   └── news.ts               # TypeScript-typer
├── .env.local                # API-nycklar (läggs INTE i git)
├── vercel.json               # Cron-konfiguration
└── AI_INSTRUCTIONS.md        # Denna fil
```

---

## MILJÖVARIABLER (.env.local)
```
ANTHROPIC_API_KEY=din_nyckel_här
```

---

## REGIONER OCH RSS-KÄLLOR

### Europa
- https://feeds.bbci.co.uk/news/world/europe/rss.xml
- https://rss.dw.com/rdf/rss-en-all

### Nordamerika
- https://feeds.npr.org/1001/rss.xml
- https://rss.nytimes.com/services/xml/rss/nyt/World.xml

### Östasien
- https://www3.nhk.or.jp/nhkworld/en/news/feeds/

### Sydostasien
- https://www.bangkokpost.com/rss/data/topstories.xml

### Sydasien
- https://feeds.feedburner.com/ndtvnews-top-stories

### Afrika
- https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf

### Mellanöstern
- https://www.aljazeera.com/xml/rss/all.xml

### Sydamerika
- https://feeds.bbci.co.uk/news/world/latin_america/rss.xml

### Oceanien
- https://www.abc.net.au/news/feed/51120/rss.xml

---

## TIDSZONLOGIK
Schemaläggaren ska prioritera regioner baserat på svensk tid (CET/CEST):

```
00:00–08:00 → Prioritera: Östasien, Sydostasien, Oceanien
06:00–18:00 → Prioritera: Europa, Afrika, Mellanöstern
14:00–04:00 → Prioritera: Nordamerika, Sydamerika
```

Alla regioner visas alltid, men prioriterade regioner visas först.
Markera aktiva regioner med en grön indikator.

---

## SEKTIONER I MORGONÖVERSIKTEN
1. **Globala huvudrubriker** – de 5 viktigaste händelserna just nu
2. **Motstånd & självorganisering** – folkrörelser, strejker, kooperativ
3. **Övervakning & kontroll** – stat, teknik, övervakning
4. **Klimat & ekologi** – miljö, klimatkris, motstånd
5. **Ekonomi underifrån** – arbetare, kooperativ, alternativ ekonomi
6. **Dagens fördjupning** – en händelse analyserad på djupet

---

## CLAUDE API – ANALYSMODELL
Använd följande systemprompt för varje nyhet:

```
Du är en anarkistisk nyhetsanalytiker inspirerad av Joseph Toscano.
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

Svara ENDAST med JSON.
```

---

## DESIGN
- **Bakgrund:** #0a0a0a (nästan svart)
- **Text:** #e8e8e8 (ljusgrå)
- **Accent MOTSTÅND:** #22c55e (grön)
- **Accent ÖVERVAKNING:** #ef4444 (röd)
- **Accent KLIMAT:** #84cc16 (lime)
- **Accent EKONOMI:** #f59e0b (gul)
- **Accent GLOBAL:** #3b82f6 (blå)
- **Font:** System-ui, sans-serif
- **Mobilfirst:** Alltid vertikal layout, min touch-target 44px

---

## OUTPUTFORMAT
Varje körning ska generera:
1. Morgonöversikt (HTML-sida)
2. JSON med alla analyserade nyheter
3. Lista med trender (återkommande teman)
4. Lista med artikelförslag till redaktionen

---

## VERCEL CRON (vercel.json)
```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 5 * * *"
    }
  ]
}
```
Kör varje dag kl 05:00 UTC (07:00 svensk tid).

---

## KODPRINCIPER
- Enkel, läsbar kod med tydliga kommentarer
- Varje modul gör EN sak
- Lätt att byta ut RSS-källor (bara ändra i regions.ts)
- Lätt att lägga till nya sektioner (bara lägga till i NewsSection)
- Fel ska hanteras mjukt – om en RSS-källa failar, fortsätt med övriga

---

## NÄSTA STEG FÖR CURSOR
1. Skapa Next.js-projekt med: `npx create-next-app@latest . --typescript --tailwind --app`
2. Installera: `npm install rss-parser @anthropic-ai/sdk`
3. Skapa filstrukturen ovan
4. Börja med `lib/regions.ts` och `lib/rss.ts`
5. Bygg sedan `lib/analyze.ts` med Claude API
6. Skapa API-route `app/api/news/route.ts`
7. Bygg frontend `app/page.tsx` och komponenter
