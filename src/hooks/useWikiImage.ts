import { useEffect, useState } from 'react';

// One request per Wikipedia page for the whole session
const cache = new Map<string, Promise<string | null>>();

const fetchWikiImage = (wikiUrl: string) => {
  if (!cache.has(wikiUrl)) {
    const title = decodeURIComponent(wikiUrl.split('/wiki/')[1] || '');
    const request = fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data?.thumbnail?.source ?? null)
      .catch(() => null);
    cache.set(wikiUrl, request);
  }
  return cache.get(wikiUrl)!;
};

// Returns the Wikipedia thumbnail for an Ergast `url`, or null when there is none
export const useWikiImage = (wikiUrl?: string, enabled = true) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!wikiUrl || !enabled) return;
    let active = true;
    fetchWikiImage(wikiUrl).then((src) => {
      if (active) setImage(src);
    });
    return () => {
      active = false;
    };
  }, [wikiUrl, enabled]);

  return image;
};
