import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../hooks/usePageMeta';
import { service } from '../services/service';
import type { Race } from '../types/api.types';
import SeasonSelector from '../components/standings/SeasonSelector';
import RaceCard, { type RaceStatus } from '../components/calendar/RaceCard';
import { CURRENT_SEASON } from '../data/f1Media';
import Reveal from '../components/common/Reveal';

// A race counts as finished ~3h after lights out; the first unfinished one is "next"
const RACE_DURATION_MS = 3 * 60 * 60 * 1000;

const getStatuses = (races: Race[]): RaceStatus[] => {
  const now = Date.now();
  let nextFound = false;
  return races.map((race) => {
    const start = new Date(`${race.date}T${race.time || '15:00:00Z'}`).getTime();
    if (start + RACE_DURATION_MS < now) return 'done';
    if (!nextFound) {
      nextFound = true;
      return 'next';
    }
    return 'upcoming';
  });
};

const Calendario = () => {
  const { t } = useTranslation();
  usePageMeta(t('calendar.title'));
  
  const [season, setSeason] = useState<string>(CURRENT_SEASON);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await service.getCalendarBySeason(season);
        const calendarRaces = response.MRData.RaceTable?.Races || [];
        setRaces(calendarRaces);
      } catch (err) {
        console.error("Failed to fetch calendar:", err);
        setError(t('calendar.error_load'));
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [season, t]);

  const statuses = getStatuses(races);

  return (
    <div className={styles.container}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className={styles.page_header}>{t('calendar.title')}</h1>
          <p className={styles.page_title}>{t('calendar.subtitle', { season })}</p>
        </div>
        <SeasonSelector currentSeason={season} onSeasonChange={setSeason} availableSeasons={["2026", "2025", "2024", "2023", "2022", "2021", "2020"]} />
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-8" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-10">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="w-full bg-white/50 dark:bg-[#151515]/50 backdrop-blur-md h-[500px] rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-10">
          {races.map((race, index) => (
            <Reveal key={race.round} index={index}>
              <RaceCard race={race} status={statuses[index]} />
            </Reveal>
          ))}
          {races.length === 0 && !error && (
            <div className="col-span-full py-20 text-center text-gray-500 font-inter">
              {t('calendar.no_data')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: "p-8 max-w-[1600px] mx-auto min-h-screen",
  page_header: "font-orbitron text-4xl font-bold text-f1-red mb-2 uppercase tracking-wide",
  page_title: "font-inter text-gray-600 dark:text-gray-400 text-lg",
};

export default Calendario;