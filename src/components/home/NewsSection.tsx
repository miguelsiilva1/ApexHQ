import { useState, useEffect, useCallback } from 'react';
import { LoadingSpinner, ErrorAlert } from '../';
import { useTranslation } from 'react-i18next';
import { getLatestNews, type NewsItem } from '../../services/news';
import NewsCard from '../news/NewsCard';
import Reveal from '../common/Reveal';

const HOME_NEWS_COUNT = 6;

const NewsSection = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLatestNews();
      setNewsData(data.slice(0, HOME_NEWS_COUNT));
    } catch {
      setError(t('news.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <section id="news-section" className={styles.newsSection}>
      <h2 className={styles.sectionTitle}>{t('news.title')}</h2>

      {loading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchNews} />
      ) : (
        <div className={styles.newsGrid}>
          {newsData.map((item, index) => (
            <Reveal key={item.id} index={index} className="flex">
              <NewsCard item={item} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
};

const styles = {
  sectionTitle: "font-orbitron text-3xl font-bold text-f1-dark dark:text-white mb-8 border-l-4 border-f1-red pl-4 uppercase",
  newsSection: "w-full scroll-mt-24",
  newsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
};

export default NewsSection;
