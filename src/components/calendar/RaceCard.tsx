import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock, ArrowRight, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Race } from '../../types/api.types';
import EntityImage from '../drivers/EntityImage';
import { trackOutlines, CURRENT_SEASON } from '../../data/f1Media';

export type RaceStatus = 'done' | 'next' | 'upcoming';

interface RaceCardProps {
  race: Race;
  status: RaceStatus;
}

const RaceCard = ({ race, status }: RaceCardProps) => {
  const { t, i18n } = useTranslation();
  const circuitId = race.Circuit.circuitId;
  const locale = i18n.language === 'en' ? 'en-GB' : 'pt-PT';

  // Ergast times are UTC; shown in the visitor's own timezone
  const raceDate = new Date(`${race.date}T${race.time || '15:00:00Z'}`);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(raceDate);

  const formattedTime = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(raceDate);

  const badge = {
    done: { label: t('calendar.status_done'), className: styles.badge_done },
    next: { label: t('calendar.status_next'), className: styles.badge_next },
    upcoming: { label: race.season, className: styles.badge_upcoming },
  }[status];

  // Results page only covers the current season
  const showResults = status === 'done' && race.season === CURRENT_SEASON;

  return (
    <div className={`${styles.card} ${status === 'next' ? styles.card_next : ''} ${status === 'done' ? styles.card_done : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.round}>
          {t('calendar.round')} {race.round}
        </span>
        <span className={badge.className}>{badge.label}</span>
      </div>

      <div className={styles.body}>
        {/* Track Title */}
        <h3 className={styles.title}>
          {t(`api.gps.${race.raceName}`, race.raceName)}
        </h3>

        {/* Info items */}
        <div className={styles.info}>
          <div className={styles.info_item}>
            <MapPin size={16} className={styles.info_icon} />
            <span className="truncate">
              {race.Circuit.circuitName}, {t(`api.countries.${race.Circuit.Location.country}`, race.Circuit.Location.country)}
            </span>
          </div>
          <div className={styles.info_item}>
            <Calendar size={16} className={styles.info_icon} />
            <span>{formattedDate}</span>
          </div>
          <div className={styles.info_item}>
            <Clock size={16} className={styles.info_icon} />
            <span>{formattedTime} ({t('calendar.local_time')})</span>
          </div>
        </div>

        {/* Track Image */}
        <div className={styles.track_wrapper}>
          <EntityImage
            localSrc={trackOutlines[circuitId]}
            wikiUrl={race.Circuit.url}
            alt={race.Circuit.circuitName}
            placeholder={race.Circuit.Location.locality}
            // Only the local outlines are dark line art; Wikipedia images must not be inverted
            className={`${styles.track_image} ${trackOutlines[circuitId] ? 'dark:invert' : ''}`}
            placeholderClassName="rounded-xl text-sm uppercase tracking-widest"
          />
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link to={`/pistas/${circuitId}`} className={styles.btn_details}>
            {t('calendar.view_details')}
            <ArrowRight size={16} />
          </Link>
          {showResults && (
            <Link to={`/resultados?round=${race.round}`} className={styles.btn_results}>
              <Flag size={16} />
              {t('calendar.view_results')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: "bg-white dark:bg-[#151515] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:border-f1-red/50 group flex flex-col h-full",
  card_next: "ring-2 ring-f1-red border-f1-red",
  card_done: "opacity-80 hover:opacity-100",
  header: "bg-gray-50 dark:bg-[#1a1a1a] p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center",
  round: "font-orbitron font-bold text-f1-red text-lg uppercase",
  badge_upcoming: "bg-f1-red/10 text-f1-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
  badge_next: "bg-f1-red text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse",
  badge_done: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",

  body: "p-6 flex-grow flex flex-col",
  title: "font-orbitron text-xl font-bold text-f1-dark dark:text-white mb-2 leading-tight min-h-[50px]",
  info: "flex flex-col gap-3 mb-6 font-inter text-sm text-gray-600 dark:text-gray-400",
  info_item: "flex items-center gap-2",
  info_icon: "text-f1-red flex-shrink-0",

  track_wrapper: "mt-auto flex-grow flex items-center justify-center p-6 bg-gray-50 dark:bg-black/20 rounded-xl mb-6 h-[250px]",
  track_image: "w-full h-full max-h-[200px] object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500",

  actions: "flex flex-col sm:flex-row gap-3",
  btn_details: "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-orbitron font-bold uppercase tracking-wider text-sm rounded-lg border-2 border-gray-200 dark:border-gray-800 text-f1-dark dark:text-white hover:bg-f1-red hover:border-f1-red hover:text-white transition-all duration-300",
  btn_results: "flex-1 py-3 px-4 flex items-center justify-center gap-2 font-orbitron font-bold uppercase tracking-wider text-sm rounded-lg bg-f1-dark dark:bg-white text-white dark:text-f1-dark hover:bg-f1-red dark:hover:bg-f1-red dark:hover:text-white transition-all duration-300",
};

export default RaceCard;
