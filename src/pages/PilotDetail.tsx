import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trophy, Flag, Medal, Timer, CalendarDays, History, ExternalLink } from 'lucide-react';
import { service, fetchAllPages } from '../services/service';
import type { Constructor, Driver, Race } from '../types/api.types';
import EntityImage from '../components/drivers/EntityImage';
import { driverImages, CURRENT_SEASON } from '../data/f1Media';
import { driverChampions, countTitles } from '../data/champions';
import { usePageMeta } from '../hooks/usePageMeta';
import { isValidId } from '../utils/format';

interface SeasonSummary {
  season: string;
  teams: Constructor[];
  wins: number;
  podiums: number;
  bestFinish: number | null;
}

interface CareerStats {
  starts: number;
  wins: number;
  podiums: number;
  poles: number;
  seasons: SeasonSummary[];
}

// Every race result of the driver -> career totals and one row per season
const buildCareer = (races: Race[]): CareerStats => {
  const seasons = new Map<string, SeasonSummary>();
  const stats: CareerStats = { starts: 0, wins: 0, podiums: 0, poles: 0, seasons: [] };

  races.forEach((race) => {
    const result = race.Results?.[0];
    if (!result) return;
    const position = Number(result.position);
    const isWin = position === 1;
    const isPodium = position >= 1 && position <= 3;

    stats.starts += 1;
    if (isWin) stats.wins += 1;
    if (isPodium) stats.podiums += 1;
    if (result.grid === '1') stats.poles += 1;

    if (!seasons.has(race.season)) {
      seasons.set(race.season, { season: race.season, teams: [], wins: 0, podiums: 0, bestFinish: null });
    }
    const summary = seasons.get(race.season)!;
    if (!summary.teams.some((team) => team.constructorId === result.Constructor.constructorId)) {
      summary.teams.push(result.Constructor);
    }
    if (isWin) summary.wins += 1;
    if (isPodium) summary.podiums += 1;
    if (/^\d+$/.test(result.positionText) && (summary.bestFinish === null || position < summary.bestFinish)) {
      summary.bestFinish = position;
    }
  });

  stats.seasons = [...seasons.values()].sort((a, b) => Number(b.season) - Number(a.season));
  return stats;
};

const getAge = (dateOfBirth: string) => {
  const birth = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age -= 1;
  return age;
};

const PilotDetail = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const { t, i18n } = useTranslation();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [career, setCareer] = useState<CareerStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  usePageMeta(
    driver ? `${driver.givenName} ${driver.familyName}` : t('drivers.title'),
    driver ? t('driver_detail.meta_description', { name: `${driver.givenName} ${driver.familyName}` }) : undefined
  );

  useEffect(() => {
    if (!isValidId(driverId)) {
      setLoading(false);
      return;
    }

    const fetchDriverData = async () => {
      setLoading(true);
      setError(null);
      try {
        const driverRes = await service.getDriver(driverId);
        const driverData = driverRes.MRData.DriverTable?.Drivers[0] || null;
        setDriver(driverData);
        if (!driverData) return;

        const pages = await fetchAllPages((offset) => service.getDriverResults(driverId, offset));
        setCareer(buildCareer(pages.flatMap((page) => page.MRData.RaceTable?.Races || [])));
      } catch (err) {
        console.error("Failed to fetch driver details:", err);
        setError(t('driver_detail.error_load'));
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [driverId, t]);

  if (loading) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.spinner}></div>
        <p className="font-inter text-gray-500">{t('driver_detail.loading')}</p>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className={styles.container}>
        <Link to="/pilotos" className={styles.back_link}>
          <ArrowLeft size={18} />
          {t('driver_detail.back')}
        </Link>
        <div className={styles.error} role="alert">
          <span className="block sm:inline">{error || t('driver_detail.no_data')}</span>
        </div>
      </div>
    );
  }

  const titles = countTitles(driverChampions, driver.driverId);
  // The API has no date of death, so age is only shown for active drivers
  const isActive = career?.seasons[0]?.season === CURRENT_SEASON;
  const birthDate = new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(driver.dateOfBirth));
  const statCards = [
    { label: t('driver_detail.championships'), value: titles, icon: Trophy },
    { label: t('driver_detail.wins'), value: career?.wins ?? 0, icon: Flag },
    { label: t('driver_detail.podiums'), value: career?.podiums ?? 0, icon: Medal },
    { label: t('driver_detail.poles'), value: career?.poles ?? 0, icon: Timer },
    { label: t('driver_detail.starts'), value: career?.starts ?? 0, icon: CalendarDays },
    { label: t('driver_detail.seasons'), value: career?.seasons.length ?? 0, icon: History },
  ];

  return (
    <div className={styles.container}>
      <Link to="/pilotos" className={styles.back_link}>
        <ArrowLeft size={18} />
        {t('driver_detail.back')}
      </Link>

      <div className={styles.panel}>
        {/* Header Section */}
        <div className={styles.hero}>
          <div className={styles.hero_pattern} style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className={styles.hero_image_wrapper}>
            <EntityImage
              localSrc={driverImages[driver.driverId]}
              wikiUrl={driver.url}
              alt={`${driver.givenName} ${driver.familyName}`}
              placeholder={driver.permanentNumber || driver.familyName.charAt(0)}
              className={styles.hero_image}
              placeholderClassName="text-6xl rounded-2xl !bg-white/5"
            />
          </div>

          <div className={styles.hero_info}>
            {driver.permanentNumber && <span className={styles.hero_number}>{driver.permanentNumber}</span>}
            <h1 className={styles.hero_name}>
              {driver.givenName} <span className="text-f1-red uppercase">{driver.familyName}</span>
            </h1>
            <div className={styles.hero_tags}>
              {driver.code && <span className={styles.tag}>{driver.code}</span>}
              <span className={styles.tag}>{driver.nationality}</span>
              <span className={styles.tag}>
                {birthDate}{isActive && ` · ${t('driver_detail.age', { age: getAge(driver.dateOfBirth) })}`}
              </span>
            </div>
            <a href={driver.url} target="_blank" rel="noopener noreferrer" className={styles.wiki_link}>
              {t('driver_detail.wikipedia')}
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.section}>
          <h2 className={styles.section_title}>{t('driver_detail.stats_title')}</h2>
          <div className={styles.stats_grid}>
            {statCards.map(({ label, value, icon: Icon }) => (
              <div key={label} className={styles.stat_card}>
                <Icon className="text-f1-red mb-3" size={24} />
                <p className={styles.stat_value}>{value}</p>
                <p className={styles.stat_label}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seasons Section */}
        {career && career.seasons.length > 0 && (
          <div className={styles.section_bordered}>
            <h2 className={styles.section_title}>{t('driver_detail.season_by_season')}</h2>
            <div className="overflow-x-auto">
              <table className={styles.table}>
                <thead>
                  <tr className={styles.table_head}>
                    <th className="p-4 w-24">{t('driver_detail.year')}</th>
                    <th className="p-4">{t('driver_detail.team')}</th>
                    <th className="p-4 text-center">{t('driver_detail.wins')}</th>
                    <th className="p-4 text-center">{t('driver_detail.podiums')}</th>
                    <th className="p-4 text-center">{t('driver_detail.best_finish')}</th>
                  </tr>
                </thead>
                <tbody className={styles.table_body}>
                  {career.seasons.map((summary) => (
                    <tr key={summary.season} className={styles.table_row}>
                      <td className="p-4 font-orbitron font-bold text-f1-red text-lg">
                        <span className="inline-flex items-center gap-2">
                          {summary.season}
                          {driverChampions[summary.season] === driver.driverId && <Trophy size={16} className="text-[#d4a017]" />}
                        </span>
                      </td>
                      <td className="p-4">
                        {summary.teams.map((team, index) => (
                          <span key={team.constructorId}>
                            {index > 0 && ', '}
                            <Link to={`/equipas/${team.constructorId}`} className={styles.team_link}>{team.name}</Link>
                          </span>
                        ))}
                      </td>
                      <td className="p-4 text-center font-semibold text-f1-dark dark:text-white">{summary.wins}</td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-400">{summary.podiums}</td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-400">{summary.bestFinish ? `P${summary.bestFinish}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: "p-8 max-w-[1200px] mx-auto min-h-screen",
  loading_container: "p-8 max-w-[1200px] mx-auto min-h-screen flex flex-col items-center justify-center",
  spinner: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-f1-red mb-4",
  back_link: "inline-flex items-center gap-2 text-f1-red hover:text-red-700 transition-colors mb-8 font-orbitron uppercase tracking-wider text-sm font-bold",
  error: "bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative",
  panel: "bg-white dark:bg-[#151515] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800",

  hero: "bg-gradient-to-r from-gray-900 to-black p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden",
  hero_pattern: "absolute inset-0 opacity-5 pointer-events-none",
  hero_image_wrapper: "z-10 w-48 h-64 md:w-56 md:h-80 flex-shrink-0 flex items-end justify-center",
  hero_image: "max-w-full max-h-full object-contain object-bottom rounded-2xl drop-shadow-2xl",
  hero_info: "z-10 text-center md:text-left flex flex-col items-center md:items-start",
  hero_number: "font-orbitron text-6xl md:text-8xl font-bold text-white/10 leading-none",
  hero_name: "font-orbitron text-4xl md:text-6xl font-bold text-white mb-6 leading-tight",
  hero_tags: "flex flex-wrap justify-center md:justify-start gap-3 mb-6",
  tag: "bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm font-inter",
  wiki_link: "inline-flex items-center gap-2 text-f1-red hover:text-red-400 font-inter text-sm font-semibold transition-colors",

  section: "p-10 md:p-16",
  section_bordered: "p-10 md:p-16 pt-0 border-t border-gray-100 dark:border-gray-800 mt-8",
  section_title: "font-orbitron text-2xl font-bold text-f1-dark dark:text-white mb-8 uppercase border-b border-gray-200 dark:border-gray-800 pb-4 pt-8",
  stats_grid: "grid grid-cols-2 md:grid-cols-3 gap-6",
  stat_card: "bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-f1-red/50 transition-colors",
  stat_value: "font-orbitron text-3xl md:text-4xl font-bold text-f1-dark dark:text-white",
  stat_label: "font-inter text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1",

  table: "w-full text-left border-collapse min-w-[600px]",
  table_head: "bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 font-inter text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-800",
  table_body: "font-inter text-sm divide-y divide-gray-100 dark:divide-gray-800",
  table_row: "hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors duration-200",
  team_link: "font-semibold text-f1-dark dark:text-white hover:text-f1-red dark:hover:text-f1-red transition-colors",
};

export default PilotDetail;
