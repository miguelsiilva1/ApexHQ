import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Newspaper } from 'lucide-react';
import type { NewsItem } from '../../services/news';
import { formatNewsDate } from '../../utils/format';

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard = ({ item }: NewsCardProps) => {
  const { i18n } = useTranslation();

  return (
    <Link to={`/noticias/${item.id}`} className={styles.card}>
      <div className={styles.image_wrapper}>
        {item.image ? (
          <img src={item.image} alt="" loading="lazy" className={styles.image} />
        ) : (
          <div className={styles.image_placeholder}><Newspaper size={40} /></div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{item.category || item.source}</span>
          <span className={styles.date}>{formatNewsDate(item.date, i18n.language)}</span>
        </div>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.excerpt}>{item.paragraphs[0]}</p>
        <span className={styles.source}>{item.source}</span>
      </div>
    </Link>
  );
};

const styles = {
  card: "w-full bg-white dark:bg-[#151515] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-f1-red/20 transition-all duration-300 group flex flex-col",
  image_wrapper: "h-48 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden",
  image: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
  image_placeholder: "w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600",
  content: "p-6 flex flex-col flex-grow",
  meta: "flex items-center justify-between gap-4 mb-2",
  category: "font-orbitron text-xs text-f1-red uppercase tracking-wider font-bold truncate",
  date: "font-inter text-xs text-gray-500 flex-shrink-0",
  title: "font-bold text-xl text-f1-dark dark:text-white mb-3 font-inter line-clamp-3 group-hover:text-f1-red transition-colors",
  excerpt: "font-inter text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4",
  source: "mt-auto font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider",
};

export default NewsCard;
