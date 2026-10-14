// Vercel function: GET /api/translate-news?id=ms-123456 -> the article's title and summary in PT-PT (DeepL).
// It only translates articles found in our own RSS feeds, so the DeepL quota can't be spent on arbitrary
// text, and each translation is cached by the CDN. In development vite.config.ts serves this same handler.
const FEEDS: Record<string, string> = {
  ms: 'https://www.motorsport.com/rss/f1/news/',
  as: 'https://www.autosport.com/rss/f1/news/',
};

// The raw query must be exactly "?id=<feed>-<guid>": extra parameters or percent-encoded variants would
// create new CDN cache keys and let repeated requests for the same article reach DeepL
const QUERY_PATTERN = /^\?id=(ms|as)-([1-9]\d{0,11})$/;
const MAX_CHARS = 5000;

const json = (body: unknown, status: number, cache = 'no-store') =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
  });

// RSS fields are plain text or CDATA; the HTML inside is translated as-is and reduced to text by the client
const field = (item: string, tag: string) => {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].replace(/^\s*<!\[CDATA\[([\s\S]*)\]\]>\s*$/, '$1').trim() : '';
};

const findItem = (xml: string, guid: string) =>
  xml.split('<item>').slice(1).find((item) => field(item, 'guid') === guid);

export async function GET(request: Request): Promise<Response> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return json({ error: 'Translation unavailable' }, 503);

  const match = new URL(request.url).search.match(QUERY_PATTERN);
  if (!match) return json({ error: 'Invalid id' }, 400);
  const [, feed, guid] = match;

  const feedResponse = await fetch(FEEDS[feed]);
  if (!feedResponse.ok) return json({ error: 'Feed unavailable' }, 502);
  const item = findItem(await feedResponse.text(), guid);
  // Briefly cached: an id requested just before the article is published must not stay blocked
  if (!item) return json({ error: 'Not found' }, 404, 'public, s-maxage=30');

  const texts = [field(item, 'title'), field(item, 'description')];
  if (texts.join('').length > MAX_CHARS) return json({ error: 'Too long' }, 413);

  // Free API keys end in ":fx" and use their own host
  const host = key.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';
  const deepl = await fetch(`https://${host}/v2/translate`, {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texts, source_lang: 'EN', target_lang: 'PT-PT', tag_handling: 'html' }),
  });
  if (!deepl.ok) return json({ error: 'Translation failed' }, 502);

  const { translations } = (await deepl.json()) as { translations: { text: string }[] };
  // Published articles don't change: keep each translation at the edge for a week
  return json(
    { title: translations[0].text, description: translations[1].text },
    200,
    'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400'
  );
}
