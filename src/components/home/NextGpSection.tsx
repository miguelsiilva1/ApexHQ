import { useState, useEffect } from 'react';
import { service } from '../../services';
import { LoadingSpinner, ErrorAlert } from '../';

const NextGpSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raceData, setRaceData] = useState<any>(null);

  const fetchNextRace = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.getNextRace();
      const nextRace = data.MRData.RaceTable?.Races[0];
      if (nextRace) {
        setRaceData(nextRace);
      } else {
        setError('Não foi possível encontrar dados sobre a próxima corrida.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao ligar aos servidores da F1. Tenta novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextRace();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short' }).format(d);
  };

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return '--:--';
    try {
      const d = new Date(`${dateStr}T${timeStr}`);
      const dayName = new Intl.DateTimeFormat('pt-PT', { weekday: 'short' }).format(d).replace('.', '');
      const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      const dayNum = new Intl.DateTimeFormat('pt-PT', { day: '2-digit' }).format(d);
      const time = timeStr.substring(0, 5);
      return `${dayNameCapitalized} ${dayNum}, ${time}`;
    } catch (e) {
      return timeStr.substring(0, 5);
    }
  };

  return (
    <section id="next-gp-section" className={styles.nextGpSection}>
      <h2 className={styles.sectionTitle}>Próximo GP</h2>
      <div className={styles.nextGpContainer}>
        <div className={styles.nextGpCard}>
          {loading ? (
            <div className="flex-grow flex items-center justify-center p-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorAlert message={error} onRetry={fetchNextRace} />
            </div>
          ) : raceData ? (
            <>
              <div className={styles.gpHeader}>
                <h3 className={styles.gpName}>{raceData.raceName}</h3>
                <p className={styles.gpDate}>
                  {raceData.FirstPractice ? formatDate(raceData.FirstPractice.date) : formatDate(raceData.date)} - {formatDate(raceData.date)}, {raceData.season}
                </p>
                <p className="font-inter text-xs opacity-75 mt-1">{raceData.Circuit.circuitName}, {raceData.Circuit.Location.country}</p>
              </div>
              <div className={styles.gpSessions}>
                {/* First Practice */}
                {raceData.FirstPractice && (
                  <div className={styles.session}>
                    <span className={styles.sessionName}>Treino Livre 1</span>
                    <span className={styles.sessionTime}>{formatDateTime(raceData.FirstPractice.date, raceData.FirstPractice.time)}</span>
                  </div>
                )}
                
                {/* Sprint vs FP2/FP3 logic */}
                {raceData.Sprint ? (
                  <>
                    <div className={styles.session}>
                      <span className={styles.sessionName}>Qualificação Sprint</span>
                      <span className={styles.sessionTime}>
                        {formatDateTime(
                          (raceData.SprintQualifying || raceData.SprintShootout || raceData.SecondPractice)?.date, 
                          (raceData.SprintQualifying || raceData.SprintShootout || raceData.SecondPractice)?.time
                        )}
                      </span>
                    </div>
                    <div className={styles.session}>
                      <span className={styles.sessionName}>Sprint</span>
                      <span className={styles.sessionTime}>{formatDateTime(raceData.Sprint.date, raceData.Sprint.time)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {raceData.SecondPractice && (
                      <div className={styles.session}>
                        <span className={styles.sessionName}>Treino Livre 2</span>
                        <span className={styles.sessionTime}>{formatDateTime(raceData.SecondPractice.date, raceData.SecondPractice.time)}</span>
                      </div>
                    )}
                    {raceData.ThirdPractice && (
                      <div className={styles.session}>
                        <span className={styles.sessionName}>Treino Livre 3</span>
                        <span className={styles.sessionTime}>{formatDateTime(raceData.ThirdPractice.date, raceData.ThirdPractice.time)}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Qualifying & Race */}
                {raceData.Qualifying && (
                  <div className={styles.session}>
                    <span className={styles.sessionName}>Qualificação Principal</span>
                    <span className={styles.sessionTime}>{formatDateTime(raceData.Qualifying.date, raceData.Qualifying.time)}</span>
                  </div>
                )}
                <div className={styles.session}>
                  <span className={styles.sessionName}>Corrida Principal</span>
                  <span className={styles.sessionTime}>{formatDateTime(raceData.date, raceData.time)}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className={styles.nextGpTrackContainer}>
          <div className={styles.nextGpTrackPlaceholder}>
            <span className={styles.trackPlaceholderText}>Ver Detalhes da Pista</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  sectionTitle: "font-orbitron text-3xl font-bold text-f1-dark dark:text-white mb-8 border-l-4 border-f1-red pl-4 uppercase",
  nextGpSection: "w-full scroll-mt-24",
  nextGpContainer: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch",
  nextGpCard: "bg-white dark:bg-[#151515] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden w-full flex flex-col transition-colors duration-300 min-h-[400px]",
  gpHeader: "bg-gradient-to-r from-f1-red to-red-800 p-6 text-white",
  gpName: "font-orbitron text-2xl font-bold uppercase",
  gpDate: "font-inter text-sm opacity-90",
  gpSessions: "p-6 space-y-4 font-inter text-f1-dark dark:text-f1-light-gray flex-grow",
  session: "flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3 last:border-0 last:pb-0",
  sessionName: "font-medium",
  sessionTime: "font-orbitron text-f1-red font-bold",
  nextGpTrackContainer: "w-full h-full min-h-[300px] rounded-xl overflow-hidden cursor-pointer group shadow-xl border border-gray-200 dark:border-gray-800 transition-colors duration-300",
  nextGpTrackPlaceholder: "w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center transition-transform duration-500 group-hover:scale-105",
  trackPlaceholderText: "font-orbitron text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase opacity-50 group-hover:opacity-100 transition-opacity duration-300",
};

export default NextGpSection;
