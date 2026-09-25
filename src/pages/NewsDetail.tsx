import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink, Newspaper } from 'lucide-react';
import { getLatestNews, type NewsItem } from '../services/news';
import NewsCard from '../components/news/NewsCard';
import { formatNewsDate } from '../utils/format';
import { usePageMeta } from '../hooks/usePageMeta';

const RELATED_COUNT = 3;

const NewsDetail = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const { t, i18n } = useTranslation();

  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  usePageMeta(article?.title || t('news.title'), article?.paragraphs[0]);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const news = await getLatestNews();
        setArticle(news.find((item) => item.id === newsId) || null);
        setRelated(news.filter((item) => item.id !== newsId).slice(0, RELATED_COUNT));
      } catch {
        setError(t('news.error'));
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [newsId, t]);

  if (loading) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={styles.container}>
        <Link to="/#news-section" className={styles.back_link}>
          <ArrowLeft size={18} />
          {t('news.back')}
        </Link>
        {/* Feeds only keep recent articles, so old links end up here */}
        <div className={styles.error} role="alert">
          <span className="block sm:inline">{error || t('news.not_found')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to="/#news-section" className={styles.back_link}>
        <ArrowLeft size={18} />
        {t('news.back')}
      </Link>

      <article className={styles.panel}>
        <div className={styles.hero}>
          {article.image ? (
            <img src={article.image} alt="" className={styles.hero_image} />
          ) : (
            <div className={styles.hero_placeholder}><Newspaper size={64} /></div>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            {article.category && <span className={styles.category}>{article.category}</span>}
            <span>{article.source}</span>
            <span>·</span>
            <time dateTime={article.date}>{formatNewsDate(article.date, i18n.language)}</time>
          </div>

          <h1 className={styles.title}>{article.title}</h1>

          <div className={styles.text}>
            {article.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <a href={article.link} target="_blank" rel="noopener noreferrer" className={styles.source_link}>
            {t('news.read_full', { source: article.source })}
            <ExternalLink size={16} />
          </a>
          <p className={styles.language_note}>{t('news.language_note')}</p>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className={styles.related_title}>{t('news.more')}</h2>
          <div className={styles.related_grid}>
            {related.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const styles = {
  container: "p-4 sm:p-8 max-w-[1200px] mx-auto min-h-screen",
  loading_container: "p-8 max-w-[1200px] mx-auto min-h-screen flex items-center justify-center",
  spinner: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-f1-red",
  back_link: "inline-flex items-center gap-2 text-f1-red hover:text-red-700 transition-colors mb-8 font-orbitron uppercase tracking-wider text-sm font-bold",
  error: "bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative",

  panel: "bg-white dark:bg-[#151515] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800",
  hero: "h-64 sm:h-[420px] bg-gray-200 dark:bg-gray-800",
  hero_image: "w-full h-full object-cover",
  hero_placeholder: "w-full h-full flex items-center justify-center text-gray-400",

  body: "p-6 sm:p-10 md:p-16 max-w-3xl",
  meta: "flex flex-wrap items-center gap-2 font-inter text-sm text-gray-500 mb-4",
  category: "font-orbitron text-xs text-f1-red uppercase tracking-wider font-bold mr-2",
  title: "font-orbitron text-3xl md:text-5xl font-bold text-f1-dark dark:text-white leading-tight mb-8",
  text: "font-inter text-lg leading-relaxed text-gray-700 dark:text-gray-300 space-y-5 mb-10",
  source_link: "inline-flex items-center gap-2 px-6 py-3 bg-f1-red text-white font-orbitron text-sm uppercase tracking-wider rounded-lg hover:bg-red-700 transition-colors",
  language_note: "mt-4 font-inter text-xs text-gray-400",

  related_title: "font-orbitron text-2xl font-bold text-f1-dark dark:text-white mb-8 border-l-4 border-f1-red pl-4 uppercase",
  related_grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
};

export default NewsDetail;
