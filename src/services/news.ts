// F1 news from public RSS feeds. The feeds don't allow browser requests (CORS), so they are
// proxied through the same origin: vite.config.ts in development, vercel.json in production.
export interface NewsItem {
  id: string;
  source: string;
  title: string;
  paragraphs: string[];
  image: string | null;
  link: string;
  date: string;
  category: string | null;
}

const FEEDS = [
  { prefix: 'ms', source: 'Motorsport.com', path: '/rss/motorsport', host: 'motorsport.com' },
  { prefix: 'as', source: 'Autosport', path: '/rss/autosport', host: 'autosport.com' },
];

// Both feeds serve their images from the Motorsport.com CDN
const IMAGE_HOST = 'motorsport.com';

const CACHE_KEY = 'apexhq_news';
const CACHE_TTL_MS = 10 * 60 * 1000;
let request: Promise<NewsItem[]> | null = null;

// Feed content is untrusted: only https URLs from the feed's own domains are kept
const safeUrl = (value: string | null | undefined, host: string) => {
  try {
    const url = new URL(value || '');
    return url.protocol === 'https:' && (url.hostname === host || url.hostname.endsWith(`.${host}`)) ? url.href : null;
  } catch {
    return null;
  }
};

// Descriptions contain HTML; it is parsed inertly and only its text is kept (never rendered as HTML)
const toParagraphs = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('a.more').forEach((el) => el.remove());
  doc.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
  return (doc.body.textContent || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
};

const parseFeed = (xml: string, feed: typeof FEEDS[number]): NewsItem[] => {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  return [...doc.querySelectorAll('item')].flatMap((item) => {
    const text = (tag: string) => item.querySelector(tag)?.textContent?.trim() || '';
    const guid = text('guid');
    const link = safeUrl(text('link'), feed.host);
    const date = new Date(text('pubDate'));
    if (!/^\d+$/.test(guid) || !link || isNaN(date.getTime())) return [];

    const categories = [...item.querySelectorAll('category')].map((c) => c.textContent?.trim() || '');
    return [{
      id: `${feed.prefix}-${guid}`,
      source: feed.source,
      title: text('title'),
      paragraphs: toParagraphs(text('description')),
      image: safeUrl(item.querySelector('enclosure')?.getAttribute('url'), IMAGE_HOST),
      link,
      date: date.toISOString(),
      category: categories.find((c) => c && c !== 'Formula 1') || null,
    }];
  });
};

const loadNews = async (): Promise<NewsItem[]> => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) return cached.items;
  } catch {
    // storage unavailable, fall through to the network
  }

  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const response = await fetch(feed.path);
      if (!response.ok) throw new Error(`News feed error: ${response.status}`);
      return parseFeed(await response.text(), feed);
    })
  );
  const items = results
    .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
    .sort((a, b) => b.date.localeCompare(a.date));
  if (items.length === 0) throw new Error('No news available');

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), items }));
  } catch {
    // not critical
  }
  return items;
};

export const getLatestNews = () => {
  if (!request) {
    request = loadNews();
    request.catch(() => {
      request = null;
    });
  }
  return request;
};
