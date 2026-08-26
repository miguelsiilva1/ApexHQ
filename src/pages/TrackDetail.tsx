import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { service } from '../services/service';
import { ArrowLeft, Trophy, Timer, MapPin } from 'lucide-react';
import type { Circuit, Race } from '../types/api.types';

// Reuse the track image map from RaceCard
const trackImageMap: Record<string, string> = {
  bahrain: 'https://en.wikipedia.org/wiki/2025_Bahrain_Grand_Prix#/media/File:Bahrain_International_Circuit--Grand_Prix_Layout.svg',
  jeddah: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Jeddah_Street_Circuit_2021.svg',
  albert_park: 'https://en.wikipedia.org/wiki/Australian_Grand_Prix#/media/File:Albert_Park_Circuit_2021.svg',
  suzuka: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Suzuka_circuit_map--2005.svg',
  shanghai: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Shanghai_International_Racing_Circuit_track_map.svg',
  miami: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Miami_International_Autodrome.svg',
  imola: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Imola_2022_layout.svg',
  monaco: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Monte_Carlo_Formula_1_track_map.svg',
  villeneuve: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Circuit_Gilles_Villeneuve.svg',
  catalunya: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Catalunya.svg',
  red_bull_ring: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Circuit_Red_Bull_Ring.svg',
  silverstone: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Silverstone_Circuit_2020.png',
  hungaroring: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Hungaroring.svg',
  spa: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Spa-Francorchamps_of_Belgium.svg',
  zandvoort: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Circuit_Zandvoort.svg',
  monza: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Monza_track_map.svg',
  baku: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Baku_Formula_One_circuit_map.svg',
  marina_bay: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Singapore_Street_Circuit_2023.svg',
  americas: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Austin_circuit.svg',
  rodriguez: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg',
  interlagos: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Circuit_Interlagos.svg',
  vegas: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Las_Vegas_Street_Circuit_2023.svg',
  losail: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Losail_International_Circuit.svg',
  yas_marina: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Yas_Marina_Circuit.svg',
};

const FALLBACK_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/F1_track_icon.svg/512px-F1_track_icon.svg.png';

const TrackDetail = () => {
  const { circuitId } = useParams<{ circuitId: string }>();
  const { t } = useTranslation();

  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [mostWins, setMostWins] = useState<{ driver: string, wins: number } | null>(null);
  const [trackRecord, setTrackRecord] = useState<{ driver: string, time: string, year: string } | null>(null);
  const [recentWinners, setRecentWinners] = useState<Race[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!circuitId) return;

    const fetchTrackData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [winnersRes, fastestRes] = await Promise.all([
          service.getCircuitWinners(circuitId),
          service.getCircuitFastestLaps(circuitId)
        ]);

        const winnerRaces = winnersRes.MRData.RaceTable?.Races || [];
        const fastestRaces = fastestRes.MRData.RaceTable?.Races || [];

        // Set Circuit Info from the first race data
        if (winnerRaces.length > 0) {
          setCircuit(winnerRaces[0].Circuit);
        } else if (fastestRaces.length > 0) {
          setCircuit(fastestRaces[0].Circuit);
        }

        // Calculate Most Wins
        if (winnerRaces.length > 0) {
          const winCounts: Record<string, { name: string, count: number }> = {};
          winnerRaces.forEach((race: Race) => {
            const winner = race.Results?.[0]?.Driver;
            if (winner) {
              const fullName = `${winner.givenName} ${winner.familyName}`;
              if (!winCounts[winner.driverId]) {
                winCounts[winner.driverId] = { name: fullName, count: 0 };
              }
              winCounts[winner.driverId].count += 1;
            }
          });

          let maxWins = 0;
          let bestDriver = "";
          Object.values(winCounts).forEach(driverInfo => {
            if (driverInfo.count > maxWins) {
              maxWins = driverInfo.count;
              bestDriver = driverInfo.name;
            }
          });

          if (maxWins > 0) {
            setMostWins({ driver: bestDriver, wins: maxWins });
          }

          // Recent winners (top 5 since it's sorted historically descending, wait, Ergast results/1 returns ascending or descending? Usually descending if no year specified, but actually it might be ascending. Let's slice the last 5 if ascending, or first 5 if descending).
          // Ergast returns chronologically (older first) by default. Let's reverse it to get recent.
          const reversedWinners = [...winnerRaces].reverse();
          setRecentWinners(reversedWinners.slice(0, 5));
        }

        // Calculate Track Record (Fastest Lap)
        if (fastestRaces.length > 0) {
          let absoluteRecordTime = Infinity;
          let recordHolder = null;

          fastestRaces.forEach((race: Race) => {
            const result = race.Results?.[0];
            const timeStr = result?.FastestLap?.Time?.time;

            if (timeStr && result?.Driver) {
              // Convert "1:23.456" to ms for comparison
              const parts = timeStr.split(':');
              let ms = 0;
              if (parts.length === 2) {
                const mins = parseInt(parts[0]);
                const secs = parseFloat(parts[1]);
                ms = (mins * 60 + secs) * 1000;
              } else {
                ms = parseFloat(timeStr) * 1000;
              }

              if (ms > 0 && ms < absoluteRecordTime) {
                absoluteRecordTime = ms;
                recordHolder = {
                  driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
                  time: timeStr,
                  year: race.season
                };
              }
            }
          });

          if (recordHolder) {
            setTrackRecord(recordHolder);
          }
        }

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
      <div className="p-8 max-w-[1200px] mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-f1-red mb-4"></div>
        <p className="font-inter text-gray-500">{t('track.loading')}</p>
      </div>
    );
  }

  if (error || !circuit) {
    return (
      <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
        <Link to="/calendario" className="inline-flex items-center gap-2 text-f1-red hover:text-red-700 transition-colors mb-8 font-inter">
          <ArrowLeft size={20} />
          {t('track.back')}
        </Link>
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error || t('track.no_data')}</span>
        </div>
      </div>
    );
  }

  const trackImage = trackImageMap[circuitId!] || FALLBACK_IMAGE;

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
      <Link to="/calendario" className="inline-flex items-center gap-2 text-f1-red hover:text-red-700 transition-colors mb-8 font-orbitron uppercase tracking-wider text-sm font-bold">
        <ArrowLeft size={18} />
        {t('track.back')}
      </Link>

      <div className="bg-white dark:bg-[#151515] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          {/* Subtle background track pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className="z-10 text-center w-full">
            <h1 className="font-orbitron text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {circuit.circuitName}
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400 font-inter text-xl mb-12">
              <MapPin className="text-f1-red" size={24} />
              <span>{circuit.Location.locality}, {t(`api.countries.${circuit.Location.country}`, circuit.Location.country)}</span>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center shadow-2xl">
              <img
                src={trackImage}
                alt={circuit.circuitName}
                className="max-w-full max-h-full object-contain filter invert opacity-90 drop-shadow-2xl"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-10 md:p-16">
          <h2 className="font-orbitron text-2xl font-bold text-f1-dark dark:text-white mb-8 uppercase border-b border-gray-200 dark:border-gray-800 pb-4">
            {t('track.stats_title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Most Wins */}
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-f1-red/50 transition-colors group">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-f1-red/10 p-3 rounded-xl group-hover:bg-f1-red/20 transition-colors">
                  <Trophy className="text-f1-red" size={32} />
                </div>
                <h3 className="font-orbitron font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm">
                  {t('track.most_wins')}
                </h3>
              </div>

              {mostWins ? (
                <div>
                  <p className="font-orbitron text-3xl font-bold text-f1-dark dark:text-white mb-2">
                    {mostWins.driver}
                  </p>
                  <p className="font-inter text-f1-red font-semibold text-lg">
                    {mostWins.wins} vitórias
                  </p>
                </div>
              ) : (
                <p className="font-inter text-gray-500">{t('track.no_data')}</p>
              )}
            </div>

            {/* Track Record */}
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-[#ffcc00]/50 transition-colors group">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#ffcc00]/10 p-3 rounded-xl group-hover:bg-[#ffcc00]/20 transition-colors">
                  <Timer className="text-[#d40511] dark:text-[#ffcc00]" size={32} />
                </div>
                <h3 className="font-orbitron font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm">
                  {t('track.fastest_lap')}
                </h3>
              </div>

              {trackRecord ? (
                <div>
                  <div className="flex items-end gap-3 mb-2">
                    <p className="font-orbitron text-4xl font-bold text-[#d40511] dark:text-[#ffcc00]">
                      {trackRecord.time}
                    </p>
                    <p className="font-inter text-gray-400 pb-1">
                      ({trackRecord.year})
                    </p>
                  </div>
                  <p className="font-inter text-f1-dark dark:text-white font-semibold text-lg uppercase">
                    {trackRecord.driver}
                  </p>
                </div>
              ) : (
                <p className="font-inter text-gray-500">{t('track.no_data')}</p>
              )}
            </div>

          </div>
        </div>

        {/* Recent Winners Section */}
        {recentWinners.length > 0 && (
          <div className="p-10 md:p-16 pt-0 border-t border-gray-100 dark:border-gray-800 mt-8">
            <h2 className="font-orbitron text-2xl font-bold text-f1-dark dark:text-white mb-8 uppercase">
              Últimos Vencedores
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 font-inter text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    <th className="p-4 w-24">Ano</th>
                    <th className="p-4">Piloto</th>
                    <th className="p-4">Construtor</th>
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
                          {winner.Driver.givenName} <span className="uppercase">{winner.Driver.familyName}</span>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-400 text-md">
                          {winner.Constructor.name}
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

export default TrackDetail;
