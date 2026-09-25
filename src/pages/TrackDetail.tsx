import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { service, fetchAllPages } from '../services/service';
import { ArrowLeft, Trophy, Timer, MapPin } from 'lucide-react';
import type { Circuit, Race } from '../types/api.types';
import EntityImage from '../components/drivers/EntityImage';
import { trackMaps } from '../data/f1Media';
import { usePageMeta } from '../hooks/usePageMeta';
import { isValidId } from '../utils/format';

// Ergast lap times are "1:23.456" or "59.123"
const lapTimeToMs = (time: string) => {
  const parts = time.split(':');
  return parts.length === 2
    ? (parseInt(parts[0]) * 60 + parseFloat(parts[1])) * 1000
    : parseFloat(time) * 1000;
};

const TrackDetail = () => {
  const { circuitId } = useParams<{ circuitId: string }>();
  const { t } = useTranslation();

  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [mostWins, setMostWins] = useState<{ driverId: string, driver: string, wins: number } | null>(null);
  const [trackRecord, setTrackRecord] = useState<{ driverId: string, driver: string, time: string, year: string } | null>(null);
  const [recentWinners, setRecentWinners] = useState<Race[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  usePageMeta(circuit?.circuitName || t('track.title'), circuit ? t('track.meta_description', { name: circuit.circuitName }) : undefined);

  useEffect(() => {
    if (!isValidId(circuitId)) {
      setLoading(false);
      return;
    }

    const fetchTrackData = async () => {
      setLoading(true);
      setError(null);
      try {
        const circuitRes = await service.getCircuit(circuitId);
        setCircuit(circuitRes.MRData.CircuitTable?.Circuits[0] || null);

        const winnerPages = await fetchAllPages((offset) => service.getCircuitWinners(circuitId, offset));
        const fastestPages = await fetchAllPages((offset) => service.getCircuitFastestLaps(circuitId, offset));
        const winnerRaces = winnerPages.flatMap((page) => page.MRData.RaceTable?.Races || []);
        const fastestRaces = fastestPages.flatMap((page) => page.MRData.RaceTable?.Races || []);

        // Most wins
        const winCounts: Record<string, { name: string, count: number }> = {};
        winnerRaces.forEach((race) => {
          const winner = race.Results?.[0]?.Driver;
          if (!winner) return;
          winCounts[winner.driverId] ??= { name: `${winner.givenName} ${winner.familyName}`, count: 0 };
          winCounts[winner.driverId].count += 1;
        });
        const best = Object.entries(winCounts).sort((a, b) => b[1].count - a[1].count)[0];
        setMostWins(best ? { driverId: best[0], driver: best[1].name, wins: best[1].count } : null);

        // Ergast returns races oldest first
        setRecentWinners([...winnerRaces].reverse().slice(0, 5));

        // Track record (fastest race lap ever)
        let record: { driverId: string, driver: string, time: string, year: string } | null = null;
        let recordMs = Infinity;
        fastestRaces.forEach((race) => {
          const result = race.Results?.[0];
          const time = result?.FastestLap?.Time?.time;
          if (!time || !result) return;
          const ms = lapTimeToMs(time);
          if (ms > 0 && ms < recordMs) {
            recordMs = ms;
            record = { driverId: result.Driver.driverId, driver: `${result.Driver.givenName} ${result.Driver.familyName}`, time, year: race.season };
          }
        });
        setTrackRecord(record);
      } catch (err) {
        console.error("Failed to fetch track details:", err);
        setError(t('calendar.error_load'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrackData();
  }, [circuitId, t]);

  if (loading) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.spinner}></div>
        <p className="font-inter text-gray-500">{t('track.loading')}</p>
      </div>
    );
  }

  if (error || !circuit) {
    return (
      <div className={styles.container}>
        <Link to="/calendario" className={styles.back_link}>
          <ArrowLeft size={18} />
          {t('track.back')}
        </Link>
        <div className={styles.error} role="alert">
          <span className="block sm:inline">{error || t('track.no_data')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to="/calendario" className={styles.back_link}>
        <ArrowLeft size={18} />
        {t('track.back')}
      </Link>

      <div className={styles.panel}>

        {/* Header Section */}
        <div className={styles.hero}>
          {/* Subtle background track pattern */}
          <div className={styles.hero_pattern} style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className="z-10 text-center w-full">
            <h1 className={styles.hero_title}>{circuit.circuitName}</h1>
            <div className={styles.hero_location}>
              <MapPin className="text-f1-red" size={24} />
              <span>{circuit.Location.locality}, {t(`api.countries.${circuit.Location.country}`, circuit.Location.country)}</span>
            </div>

            {/* The official detailed maps are drawn for a light background */}
            <div className={styles.map_wrapper}>
              <EntityImage
                localSrc={trackMaps[circuit.circuitId]}
                wikiUrl={circuit.url}
                alt={circuit.circuitName}
                placeholder={circuit.Location.locality}
                className={styles.map_image}
                placeholderClassName="rounded-2xl uppercase tracking-widest"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.section}>
          <h2 className={styles.section_title}>{t('track.stats_title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Most Wins */}
            <div className={`${styles.stat_card} hover:border-f1-red/50`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-f1-red/10 p-3 rounded-xl group-hover:bg-f1-red/20 transition-colors">
                  <Trophy className="text-f1-red" size={32} />
                </div>
                <h3 className={styles.stat_label}>{t('track.most_wins')}</h3>
              </div>

              {mostWins ? (
                <div>
                  <Link to={`/pilotos/${mostWins.driverId}`} className={styles.stat_driver}>{mostWins.driver}</Link>
                  <p className="font-inter text-f1-red font-semibold text-lg">
                    {t('track.wins_count', { count: mostWins.wins })}
                  </p>
                </div>
              ) : (
                <p className="font-inter text-gray-500">{t('track.no_data')}</p>
              )}
            </div>

            {/* Track Record */}
            <div className={`${styles.stat_card} hover:border-[#ffcc00]/50`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#ffcc00]/10 p-3 rounded-xl group-hover:bg-[#ffcc00]/20 transition-colors">
                  <Timer className="text-[#d40511] dark:text-[#ffcc00]" size={32} />
                </div>
                <h3 className={styles.stat_label}>{t('track.fastest_lap')}</h3>
              </div>

              {trackRecord ? (
                <div>
                  <div className="flex items-end gap-3 mb-2">
                    <p className="font-orbitron text-4xl font-bold text-[#d40511] dark:text-[#ffcc00]">{trackRecord.time}</p>
                    <p className="font-inter text-gray-400 pb-1">({trackRecord.year})</p>
                  </div>
                  <Link to={`/pilotos/${trackRecord.driverId}`} className="font-inter text-f1-dark dark:text-white font-semibold text-lg uppercase hover:text-f1-red transition-colors">
                    {trackRecord.driver}
                  </Link>
                </div>
              ) : (
                <p className="font-inter text-gray-500">{t('track.no_data')}</p>
              )}
            </div>

          </div>
        </div>

        {/* Recent Winners Section */}
        {recentWinners.length > 0 && (
          <div className={styles.section_bordered}>
            <h2 className={styles.section_title}>{t('track.recent_winners')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className={styles.table_head}>
                    <th className="p-4 w-24">{t('track.year')}</th>
                    <th className="p-4">{t('track.driver')}</th>
                    <th className="p-4">{t('track.constructor')}</th>
                  </tr>
                </thead>
                <tbody className="font-inter text-sm divide-y divide-gray-100 dark:divide-gray-800">
                  {recentWinners.map((race) => {
                    const winner = race.Results?.[0];
                    if (!winner) return null;
                    return (
                      <tr key={race.season} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors duration-200">
                        <td className="p-4 font-orbitron font-bold text-f1-red text-lg">{race.season}</td>
                        <td className="p-4 font-semibold text-f1-dark dark:text-white text-lg">
                          <Link to={`/pilotos/${winner.Driver.driverId}`} className="hover:text-f1-red transition-colors">
                            {winner.Driver.givenName} <span className="uppercase">{winner.Driver.familyName}</span>
                          </Link>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-400 text-md">
                          <Link to={`/equipas/${winner.Constructor.constructorId}`} className="hover:text-f1-red transition-colors">
                            {winner.Constructor.name}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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

  hero: "bg-gradient-to-r from-gray-900 to-black p-6 sm:p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden",
  hero_pattern: "absolute inset-0 opacity-5 pointer-events-none",
  hero_title: "font-orbitron text-4xl md:text-7xl font-bold text-white mb-6 leading-tight",
  hero_location: "flex items-center justify-center gap-2 text-gray-400 font-inter text-xl mb-12",
  map_wrapper: "bg-white p-4 sm:p-8 rounded-3xl w-full max-w-4xl mx-auto h-[280px] sm:h-[420px] flex items-center justify-center shadow-2xl",
  map_image: "max-w-full max-h-full object-contain",

  section: "p-6 sm:p-10 md:p-16",
  section_bordered: "p-6 sm:p-10 md:p-16 pt-0 border-t border-gray-100 dark:border-gray-800 mt-8",
  section_title: "font-orbitron text-2xl font-bold text-f1-dark dark:text-white mb-8 uppercase border-b border-gray-200 dark:border-gray-800 pb-4 pt-8",
  stat_card: "bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 transition-colors group",
  stat_label: "font-orbitron font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm",
  stat_driver: "block font-orbitron text-3xl font-bold text-f1-dark dark:text-white mb-2 hover:text-f1-red transition-colors",
  table_head: "bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 font-inter text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-800",
};

export default TrackDetail;
