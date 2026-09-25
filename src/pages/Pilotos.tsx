import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../hooks/usePageMeta';
import { service } from '../services/service';
import type { Constructor, Driver } from '../types/api.types';
import SeasonSelector from '../components/standings/SeasonSelector';
import TeamCard, { type TeamEntry } from '../components/drivers/TeamCard';
import DriverSearch from '../components/drivers/DriverSearch';
import LegendCard from '../components/drivers/LegendCard';
import { useF1Directory } from '../hooks/useF1Directory';
import { legendDrivers, legendTeams } from '../data/legends';
import { driverChampions, constructorChampions, countTitles } from '../data/champions';
import { CURRENT_SEASON } from '../data/f1Media';
import Reveal from '../components/common/Reveal';

type Tab = 'grid' | 'legends';

// Groups drivers by the last team they raced for in the season
const fetchSeasonGrid = async (season: string): Promise<TeamEntry[]> => {
  const standingsRes = await service.getDriverStandingsBySeason(season);
  const standings = standingsRes.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings || [];
  const teams = new Map<string, TeamEntry>();

  if (standings.length > 0) {
    standings.forEach(({ Driver, Constructors }) => {
      const constructor = Constructors[Constructors.length - 1];
      if (!constructor) return;
      if (!teams.has(constructor.constructorId)) teams.set(constructor.constructorId, { constructor, drivers: [] });
      teams.get(constructor.constructorId)!.drivers.push(Driver);
    });
  } else {
    // Season without races yet: ask each constructor for its entered drivers
    const constructorsRes = await service.getSeasonConstructors(season);
    const constructors: Constructor[] = constructorsRes.MRData.ConstructorTable?.Constructors || [];
    for (const constructor of constructors) {
      const driversRes = await service.getSeasonConstructorDrivers(season, constructor.constructorId);
      const drivers: Driver[] = driversRes.MRData.DriverTable?.Drivers || [];
      teams.set(constructor.constructorId, { constructor, drivers });
    }
  }

  return [...teams.values()].sort((a, b) => a.constructor.name.localeCompare(b.constructor.name));
};

const Pilotos = () => {
  const { t } = useTranslation();
  usePageMeta(t('drivers.title'));

  const [tab, setTab] = useState<Tab>('grid');
  const [season, setSeason] = useState<string>(CURRENT_SEASON);
  const [teams, setTeams] = useState<TeamEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { directory, loading: legendsLoading, error: legendsError } = useF1Directory(tab === 'legends');

  useEffect(() => {
    const loadGrid = async () => {
      setLoading(true);
      setError(null);
      try {
        setTeams(await fetchSeasonGrid(season));
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
        setError(t('drivers.error_load'));
      } finally {
        setLoading(false);
      }
    };

    loadGrid();
  }, [season, t]);

  const legendDriverData = legendDrivers
    .map((id) => directory?.drivers.find((d) => d.driverId === id))
    .filter((d): d is Driver => !!d);
  const legendTeamData = legendTeams
    .map((id) => directory?.constructors.find((c) => c.constructorId === id))
    .filter((c): c is Constructor => !!c);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.page_header}>{t('drivers.title')}</h1>
          <p className={styles.page_title}>
            {tab === 'grid' ? t('drivers.subtitle', { season }) : t('drivers.legends_subtitle')}
          </p>
        </div>
        <div className={styles.header_actions}>
          <DriverSearch />
          {tab === 'grid' && <SeasonSelector currentSeason={season} onSeasonChange={setSeason} />}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['grid', 'legends'] as Tab[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`${styles.tab} ${tab === key ? styles.tab_active : styles.tab_inactive}`}
          >
            {t(`drivers.tab_${key}`)}
          </button>
        ))}
      </div>

      {tab === 'grid' && (
        <>
          {error && (
            <div className={styles.error} role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className={styles.grid}>
            {loading
              ? [...Array(6)].map((_, index) => <div key={index} className={styles.skeleton}></div>)
              : teams.map((team, index) => (
                  <Reveal key={team.constructor.constructorId} index={index}>
                    <TeamCard team={team} season={season} />
                  </Reveal>
                ))}
            {!loading && teams.length === 0 && !error && (
              <div className={styles.empty}>{t('drivers.no_data')}</div>
            )}
          </div>
        </>
      )}

      {tab === 'legends' && (
        <>
          {legendsError && (
            <div className={styles.error} role="alert">
              <span className="block sm:inline">{t('drivers.error_load')}</span>
            </div>
          )}

          <h2 className={styles.section_title}>{t('drivers.legend_drivers')}</h2>
          <div className={styles.legends_grid}>
            {legendsLoading
              ? [...Array(8)].map((_, index) => <div key={index} className={styles.legend_skeleton}></div>)
              : legendDriverData.map((driver, index) => (
                  <Reveal key={driver.driverId} index={index}>
                    <LegendCard
                      to={`/pilotos/${driver.driverId}`}
                      name={`${driver.givenName} ${driver.familyName}`}
                      nationality={driver.nationality}
                      wikiUrl={driver.url}
                      titles={countTitles(driverChampions, driver.driverId)}
                    />
                  </Reveal>
                ))}
          </div>

          <h2 className={styles.section_title}>{t('drivers.legend_teams')}</h2>
          <div className={styles.legends_grid}>
            {legendsLoading
              ? [...Array(4)].map((_, index) => <div key={index} className={styles.legend_skeleton}></div>)
              : legendTeamData.map((team, index) => (
                  <Reveal key={team.constructorId} index={index}>
                    <LegendCard
                      to={`/equipas/${team.constructorId}`}
                      name={team.name}
                      nationality={team.nationality}
                      wikiUrl={team.url}
                      titles={countTitles(constructorChampions, team.constructorId)}
                    />
                  </Reveal>
                ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: "p-8 max-w-[1600px] mx-auto min-h-screen",
  header: "flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4",
  header_actions: "flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto",
  page_header: "font-orbitron text-4xl font-bold text-f1-red mb-2 uppercase tracking-wide",
  page_title: "font-inter text-gray-600 dark:text-gray-400 text-lg",

  tabs: "flex gap-2 mb-10 border-b border-gray-200 dark:border-gray-800",
  tab: "px-5 py-3 font-orbitron text-sm font-bold uppercase tracking-wider border-b-2 -mb-px transition-colors",
  tab_active: "border-f1-red text-f1-red",
  tab_inactive: "border-transparent text-gray-500 dark:text-gray-400 hover:text-f1-dark dark:hover:text-white",

  error: "bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-8",
  grid: "grid grid-cols-1 lg:grid-cols-2 gap-10",
  skeleton: "w-full bg-white/50 dark:bg-[#151515]/50 backdrop-blur-md h-[420px] rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800",
  empty: "col-span-full py-20 text-center text-gray-500 font-inter",

  section_title: "font-orbitron text-2xl font-bold text-f1-dark dark:text-white mb-6 uppercase border-l-4 border-f1-red pl-4",
  legends_grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-14",
  legend_skeleton: "w-full h-80 rounded-2xl animate-pulse bg-white/50 dark:bg-[#151515]/50 border border-gray-200 dark:border-gray-800",
};

export default Pilotos;
