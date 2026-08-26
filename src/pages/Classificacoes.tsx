import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { service } from '../services/service';
import type { DriverStanding, ConstructorStanding, Race } from '../types/api.types';

import SeasonSelector from '../components/standings/SeasonSelector';
import DriverStandingsTable from '../components/standings/DriverStandingsTable';
import ConstructorStandingsTable from '../components/standings/ConstructorStandingsTable';
import FastestLapsTable from '../components/standings/FastestLapsTable';

const Classificacoes = () => {
  const { t } = useTranslation();
  
  const [season, setSeason] = useState<string>("2026");
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [fastestLaps, setFastestLaps] = useState<Race[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      setError(null);
      try {
        const [driverRes, constructorRes, fastestRes] = await Promise.all([
          service.getDriverStandingsBySeason(season),
          service.getConstructorStandingsBySeason(season),
          service.getFastestLapsBySeason(season)
        ]);

        const dStandings = driverRes.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings || [];
        const cStandings = constructorRes.MRData.StandingsTable?.StandingsLists[0]?.ConstructorStandings || [];
        const fLaps = fastestRes.MRData.RaceTable?.Races || [];

        setDriverStandings(dStandings);
        setConstructorStandings(cStandings);
        setFastestLaps(fLaps);
      } catch (err) {
        console.error("Failed to fetch standings:", err);
        setError(t('standings.error_load'));
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [season, t]);

  return (
    <div className={styles.container}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className={styles.page_header}>{t('standings.title')}</h1>
          <p className={styles.page_title}>{t('standings.subtitle', { season })}</p>
        </div>
        <SeasonSelector currentSeason={season} onSeasonChange={setSeason} />
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-12">
        <DriverStandingsTable standings={driverStandings} loading={loading} />
        <ConstructorStandingsTable standings={constructorStandings} loading={loading} />
        <FastestLapsTable races={fastestLaps} loading={loading} />
      </div>
    </div>
  );
};

const styles = {
  container: "p-8 max-w-7xl mx-auto min-h-screen",
  page_header: "font-orbitron text-4xl font-bold text-f1-red mb-2 uppercase tracking-wide",
  page_title: "font-inter text-gray-600 dark:text-gray-400 text-lg",
};

export default Classificacoes;