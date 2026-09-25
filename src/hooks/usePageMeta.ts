import { useEffect } from 'react';

const SITE_NAME = 'ApexHQ';

const setMeta = (selector: string, content: string) => {
  document.querySelector(selector)?.setAttribute('content', content);
};

// Per-page <title> and description (also used for the Open Graph tags in index.html)
export const usePageMeta = (title?: string, description?: string) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - F1 Hub`;
    document.title = fullTitle;
    setMeta('meta[property="og:title"]', fullTitle);
    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
    }
  }, [title, description]);
};
