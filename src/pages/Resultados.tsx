import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Trophy, CalendarDays, Loader2 } from 'lucide-react';
import { service } from '../services';
import type { Race } from '../types/api.types';
import { ErrorAlert } from '../components';

const Resultados = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [calendar, setCalendar] = useState<Race[]>([]);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  
  const [raceResult, setRaceResult] = useState<Race | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [calData, lastRaceData] = await Promise.all([
          service.getCurrentCalendar(),
          service.getLastRaceResults()
        ]);
        
        const races = calData.MRData.RaceTable?.Races || [];
        setCalendar(races);
        
        const lastRace = lastRaceData.MRData.RaceTable?.Races[0];
        if (lastRace) {
          setRaceResult(lastRace);
          setSelectedRound(lastRace.round);
        } else {
          setError(t('results.error_load_last'));
        }
      } catch (err) {
        setError(t('results.error_load_generic'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleRoundChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRound = e.target.value;
    setSelectedRound(newRound);
    
    if (!newRound) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await service.getRaceResults(newRound);
      const race = data.MRData.RaceTable?.Races[0];
      
      if (race) {
        setRaceResult(race);
      } else {
        setError(t('results.error_load_specific_unavailable'));
        setRaceResult(null);
      }
    } catch (err) {
      setError(t('results.error_load_specific'));
      setRaceResult(null);
    } finally {
      setLoading(false);
    }
  };

  const results = raceResult?.Results || [];
  
  const first = results.find(r => r.position === '1');
  const second = results.find(r => r.position === '2');
  const third = results.find(r => r.position === '3');
  const others = results.filter(r => parseInt(r.position) > 3);

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.backButton}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {t('results.back')}
        </button>
        
        <h1 className={styles.pageTitle}>{t('results.title')}</h1>
      </div>

      <div className={styles.controlsArea}>
        <div className={styles.selectorGroup}>
          <label htmlFor="race-selector" className={styles.selectorLabel}>
            <CalendarDays className="w-4 h-4 mr-2 text-f1-red" />
            {t('results.select_gp')}
          </label>
          <select 
            id="race-selector"
            className={styles.selectInput}
            value={selectedRound || ''}
            onChange={handleRoundChange}
            disabled={loading || calendar.length === 0}
          >
            {calendar.map((race) => (
              <option key={race.round} value={race.round}>
                {t('results.stage')} {race.round}: {t(`api.gps.${race.raceName}`, race.raceName) as string}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className="w-12 h-12 text-f1-red animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-inter">{t('results.loading')}</p>
        </div>
      ) : error ? (
        <ErrorAlert message={error} onRetry={() => selectedRound ? handleRoundChange({target: {value: selectedRound}} as any) : window.location.reload()} />
      ) : raceResult && results.length > 0 ? (
        <div className={styles.contentArea}>
          
          <div className={styles.raceHeader}>
            <h2 className={styles.raceName}>{t(`api.gps.${raceResult.raceName}`, raceResult.raceName) as string}</h2>
            <p className={styles.raceDetails}>
              {raceResult.Circuit.circuitName}, {t(`api.countries.${raceResult.Circuit.Location.country}`, raceResult.Circuit.Location.country) as string} | {new Date(raceResult.date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'pt-PT')}
            </p>
          </div>

          <div className={styles.podiumContainer}>
            <div className={`${styles.podiumStep} ${styles.podiumSecond}`}>
              <div className={styles.podiumDriverInfo}>
                <span className={styles.podiumDriverName}>{second?.Driver.familyName}</span>
                <span className={styles.podiumConstructor}>{second?.Constructor.name}</span>
                <span className={styles.podiumPoints}>{second?.points} pts</span>
              </div>
              <div className="bg-gray-300 dark:bg-gray-700 h-24 w-full flex items-end justify-center rounded-t-lg relative shadow-inner">
                <span className={styles.podiumNumber}>2</span>
              </div>
            </div>
            
            <div className={`${styles.podiumStep} ${styles.podiumFirst}`}>
              <Trophy className="w-12 h-12 text-yellow-400 mb-2 drop-shadow-md" />
              <div className={styles.podiumDriverInfo}>
                <span className={`${styles.podiumDriverName} text-xl text-yellow-500`}>{first?.Driver.givenName} {first?.Driver.familyName}</span>
                <span className={styles.podiumConstructor}>{first?.Constructor.name}</span>
                <span className={`${styles.podiumPoints} text-f1-red font-bold`}>{first?.points} pts</span>
              </div>
              <div className="bg-yellow-400 dark:bg-yellow-600 h-32 w-full flex items-end justify-center rounded-t-lg relative shadow-inner">
                <span className={styles.podiumNumber}>1</span>
              </div>
            </div>

            <div className={`${styles.podiumStep} ${styles.podiumThird}`}>
              <div className={styles.podiumDriverInfo}>
                <span className={styles.podiumDriverName}>{third?.Driver.familyName}</span>
                <span className={styles.podiumConstructor}>{third?.Constructor.name}</span>
                <span className={styles.podiumPoints}>{third?.points} pts</span>
              </div>
              <div className="bg-orange-400 dark:bg-orange-800 h-16 w-full flex items-end justify-center rounded-t-lg relative shadow-inner">
                <span className={styles.podiumNumber}>3</span>
              </div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.th}>{t('results.position')}</th>
                  <th className={styles.th}>{t('results.number')}</th>
                  <th className={styles.th}>{t('results.driver')}</th>
                  <th className={styles.th}>{t('results.team')}</th>
                  <th className={styles.th}>{t('results.time_status')}</th>
                  <th className={`${styles.th} text-right`}>{t('results.points')}</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {others.map((result) => (
                  <tr key={result.number} className={styles.tr}>
                    <td className={`${styles.td} font-bold`}>{result.position}</td>
                    <td className={`${styles.td} text-gray-500`}>{result.number}</td>
                    <td className={`${styles.td} font-medium`}>
                      {result.Driver.givenName} {result.Driver.familyName}
                    </td>
                    <td className={styles.td}>{result.Constructor.name}</td>
                    <td className={styles.td}>
                      {result.Time?.time || result.status}
                    </td>
                    <td className={`${styles.td} text-right font-orbitron font-semibold text-f1-red`}>
                      {parseInt(result.points) > 0 ? `+${result.points}` : result.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {t('results.no_data')}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: "container mx-auto px-4 py-8 max-w-6xl",
  headerArea: "flex flex-col md:flex-row md:items-center mb-8 gap-4",
  backButton: "flex items-center text-gray-600 dark:text-gray-300 hover:text-f1-red dark:hover:text-f1-red transition-colors w-fit font-medium",
  pageTitle: "font-orbitron text-3xl md:text-4xl font-bold uppercase border-l-4 border-f1-red pl-4 text-f1-dark dark:text-white",
  
  controlsArea: "bg-white dark:bg-[#151515] p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 mb-8 flex items-center justify-between",
  selectorGroup: "flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto",
  selectorLabel: "font-orbitron font-medium text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide flex items-center",
  selectInput: "bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-f1-red focus:border-f1-red block w-full sm:w-80 p-3 font-inter shadow-sm transition-colors cursor-pointer",
  
  loadingContainer: "py-24 text-center",
  
  contentArea: "space-y-12 animate-fade-in",
  raceHeader: "text-center space-y-2",
  raceName: "font-orbitron text-3xl font-bold text-f1-dark dark:text-white uppercase",
  raceDetails: "font-inter text-gray-500 dark:text-gray-400 tracking-wide",

  podiumContainer: "flex items-end justify-center gap-2 md:gap-6 pt-10 px-2 max-w-3xl mx-auto h-[350px]",
  podiumStep: "flex flex-col items-center flex-1 w-1/3 relative",
  podiumFirst: "z-10 -mt-8",
  podiumSecond: "z-0",
  podiumThird: "z-0",
  podiumDriverInfo: "flex flex-col items-center mb-4 text-center px-1",
  podiumDriverName: "font-orbitron font-bold text-sm md:text-base text-f1-dark dark:text-white uppercase leading-tight",
  podiumConstructor: "font-inter text-xs text-gray-500 dark:text-gray-400 mb-1",
  podiumPoints: "font-inter text-sm font-semibold text-gray-700 dark:text-gray-300",
  podiumNumber: "font-orbitron text-4xl font-bold text-white/50 pb-2",

  tableWrapper: "overflow-x-auto bg-white dark:bg-[#151515] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800",
  table: "w-full text-left border-collapse min-w-[600px]",
  tableHead: "bg-gray-50 dark:bg-gray-900/50 uppercase text-xs font-orbitron text-gray-500 dark:text-gray-400 tracking-wider",
  th: "p-4 border-b border-gray-200 dark:border-gray-800",
  tableBody: "font-inter text-sm text-gray-800 dark:text-gray-200",
  tr: "border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors",
  td: "p-4",
};

export default Resultados;
