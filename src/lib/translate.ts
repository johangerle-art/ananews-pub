/**
 * Översättning via MyMemory API (gratis, ingen nyckel krävs)
 */

const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

export async function translateToSwedish(
  text: string,
  fromLang = "en"
): Promise<string> {
  if (!text || text.trim().length === 0) return text;

  try {
    const params = new URLSearchParams({
      q: text.slice(0, 500), // MyMemory har gräns på ~500 tecken per request
      langpair: `${fromLang}|sv`,
    });

    const res = await fetch(`${MYMEMORY_URL}?${params}`);
    const data = (await res.json()) as {
      responseData?: { translatedText?: string };
    };

    return data.responseData?.translatedText ?? text;
  } catch (error) {
    console.warn("Översättningsfel:", error);
    return text;
  }
}
