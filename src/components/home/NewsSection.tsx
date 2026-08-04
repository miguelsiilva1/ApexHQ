import { useState, useEffect } from 'react';
import { service } from '../../services';
import { LoadingSpinner, ErrorAlert } from '../';

const NewsSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsData, setNewsData] = useState<any[]>([]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.getLatestNews() as any[];
      setNewsData(data);
    } catch (err) {
      setError('Ocorreu um erro ao carregar as notícias. Tenta novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section id="news-section" className={styles.newsSection}>
      <h2 className={styles.sectionTitle}>Destaques & Últimas Notícias</h2>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchNews} />
      ) : (
        <div className={styles.newsGrid}>
          {newsData.map((item) => (
            <div key={item.id} className={styles.newsCard}>
              <div 
                className={styles.newsImagePlaceholder}
                style={{ backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>
              <div className={styles.newsCardContent}>
                <p className={styles.newsCategory}>{item.category}</p>
                <h3 className={styles.newsTitle}>{item.title}</h3>
                <p className={styles.newsExcerpt}>{item.excerpt}</p>
              </div>
            </div>
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
  newsCard: "bg-white dark:bg-[#151515] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-f1-red/20 transition-all duration-300 cursor-pointer group flex flex-col",
  newsImagePlaceholder: "h-48 w-full bg-gray-300 dark:bg-gray-800 group-hover:opacity-80 transition-opacity",
  newsCardContent: "p-6 flex flex-col flex-grow",
  newsCategory: "font-orbitron text-xs text-f1-red uppercase tracking-wider mb-2 font-bold",
  newsTitle: "font-bold text-xl text-f1-dark dark:text-white mb-3 font-inter",
  newsExcerpt: "font-inter text-gray-600 dark:text-gray-400 text-sm line-clamp-3",
};

export default NewsSection;
