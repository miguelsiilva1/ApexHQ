import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import EntityImage from './EntityImage';

interface LegendCardProps {
  to: string;
  name: string;
  nationality: string;
  wikiUrl: string;
  titles: number;
}

const LegendCard = ({ to, name, nationality, wikiUrl, titles }: LegendCardProps) => {
  const { t } = useTranslation();

  return (
    <Link to={to} className={styles.card}>
      <div className={styles.image_wrapper}>
        <EntityImage
          wikiUrl={wikiUrl}
          alt={name}
          placeholder={name.charAt(0)}
          className={styles.image}
          placeholderClassName="text-5xl"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.nationality}>{nationality}</p>
        {titles > 0 && (
          <span className={styles.titles}>
            <Trophy size={14} />
            {t('drivers.titles', { count: titles })}
          </span>
        )}
      </div>
    </Link>
  );
};

const styles = {
  card: "bg-white dark:bg-[#151515] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-f1-red/50 hover:shadow-2xl transition-all duration-300 group flex flex-col",
  image_wrapper: "h-56 bg-gray-100 dark:bg-[#1a1a1a] overflow-hidden",
  image: "w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500",
  body: "p-5 flex flex-col gap-1",
  name: "font-orbitron text-lg font-bold text-f1-dark dark:text-white uppercase",
  nationality: "font-inter text-sm text-gray-500 dark:text-gray-400",
  titles: "mt-2 inline-flex items-center gap-1.5 self-start bg-f1-red/10 text-f1-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
};

export default LegendCard;
