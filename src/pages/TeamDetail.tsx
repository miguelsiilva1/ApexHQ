import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trophy, Flag, Medal, Timer, History, ExternalLink } from 'lucide-react';
import { service } from '../services/service';
import type { Constructor, Driver } from '../types/api.types';
import EntityImage from '../components/drivers/EntityImage';
import { driverImages, teamLogos, teamCars, teamColors, DEFAULT_TEAM_COLOR, CURRENT_SEASON } from '../data/f1Media';
import { constructorChampions, countTitles, isChampion as isSeasonChampion } from '../data/champions';

interface TeamStats {
  wins: number;
  podiums: number;
  poles: number;
}

const TeamDetail = () => {
  const { constructorId } = useParams<{ constructorId: string }>();
  const { t } = useTranslation();

  const [team, setTeam] = useState<Constructor | null>(null);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!constructorId) return;

    const fetchTeamData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Sequential on purpose: Jolpica rejects bursts of parallel requests
        const teamRes = await service.getConstructor(constructorId);
        const teamData = teamRes.MRData.ConstructorTable?.Constructors[0] || null;
        setTeam(teamData);
        if (!teamData) return;

        const seasonsRes = await service.getConstructorSeasons(constructorId);
        const seasonList = (seasonsRes.MRData.SeasonTable?.Seasons || []).map((s) => s.season);
        setSeasons([...seasonList].reverse());

        const wins = await service.getConstructorResultCount(constructorId, 'results/1');
        const seconds = await service.getConstructorResultCount(constructorId, 'results/2');
        const thirds = await service.getConstructorResultCount(constructorId, 'results/3');
        const poles = await service.getConstructorResultCount(constructorId, 'grid/1/results');
        setStats({ wins, podiums: wins + seconds + thirds, poles });

        const lastSeason = seasonList[seasonList.length - 1];
        if (lastSeason) {
          // Standings only list drivers who raced (the drivers endpoint also includes FP1 runners)
          const standingsRes = await service.getDriverStandingsBySeason(lastSeason);
          const standings = standingsRes.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings || [];
          setDrivers(standings
            .filter((s) => s.Constructors.some((c) => c.constructorId === constructorId))
            .map((s) => s.Driver));
        }
      } catch (err) {
        console.error("Failed to fetch team details:", err);
        setError(t('team_detail.error_load'));
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [constructorId, t]);

  if (loading) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.spinner}></div>
        <p className="font-inter text-gray-500">{t('team_detail.loading')}</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className={styles.container}>
        <Link to="/pilotos" className={styles.back_link}>
          <ArrowLeft size={18} />
          {t('team_detail.back')}
        </Link>
        <div className={styles.error} role="alert">
          <span className="block sm:inline">{error || t('team_detail.no_data')}</span>
        </div>
      </div>
    );
  }

  const color = teamColors[team.constructorId] || DEFAULT_TEAM_COLOR;
  const lastSeason = seasons[0];
  const isActive = lastSeason === CURRENT_SEASON;
  const car = isActive ? teamCars[team.constructorId] : undefined;
  const statCards = [
    { label: t('team_detail.championships'), value: countTitles(constructorChampions, team.constructorId), icon: Trophy },
    { label: t('team_detail.wins'), value: stats?.wins ?? 0, icon: Flag },
    { label: t('team_detail.podiums'), value: stats?.podiums ?? 0, icon: Medal },
    { label: t('team_detail.poles'), value: stats?.poles ?? 0, icon: Timer },
    { label: t('team_detail.seasons'), value: seasons.length, icon: History },
  ];

  return (
    <div className={styles.container}>
      <Link to="/pilotos" className={styles.back_link}>
        <ArrowLeft size={18} />
        {t('team_detail.back')}
      </Link>

      <div className={styles.panel} style={{ borderTopColor: color }}>
        {/* Header Section */}
        <div className={styles.hero}>
          <div className={styles.hero_pattern} style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className={styles.hero_top}>
            <div className={styles.hero_logo_wrapper}>
              <EntityImage
                localSrc={teamLogos[team.constructorId]}
                wikiUrl={team.url}
                alt={`${team.name} Logo`}
                placeholder={team.name.charAt(0)}
                className={styles.hero_logo}
                placeholderClassName="text-5xl rounded-2xl !bg-white/5"
              />
            </div>
            <div className={styles.hero_info}>
              <h1 className={styles.hero_name}>{team.name}</h1>
              <div className={styles.hero_tags}>
                <span className={styles.tag}>{team.nationality}</span>
                {seasons.length > 0 && (
                  <span className={styles.tag}>
                    {seasons[seasons.length - 1]} – {isActive ? t('team_detail.present') : lastSeason}
                  </span>
                )}
              </div>
              <a href={team.url} target="_blank" rel="noopener noreferrer" className={styles.wiki_link}>
                {t('driver_detail.wikipedia')}
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {car && <img src={car} alt={`${team.name} Car`} className={styles.hero_car} />}
        </div>

        {/* Stats Section */}
        <div className={styles.section}>
          <h2 className={styles.section_title}>{t('team_detail.stats_title')}</h2>
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

        {/* Drivers Section */}
        {drivers.length > 0 && (
          <div className={styles.section_bordered}>
            <h2 className={styles.section_title}>
              {isActive ? t('team_detail.current_drivers') : t('team_detail.last_drivers', { season: lastSeason })}
            </h2>
            <div className={styles.drivers_grid}>
              {drivers.map((driver) => (
                <Link key={driver.driverId} to={`/pilotos/${driver.driverId}`} className={styles.driver_card}>
                  <div className={styles.driver_image_wrapper}>
                    <EntityImage
                      localSrc={driverImages[driver.driverId]}
                      wikiUrl={driver.url}
                      alt={`${driver.givenName} ${driver.familyName}`}
                      placeholder={driver.permanentNumber || driver.familyName.charAt(0)}
                      className={styles.driver_image}
                      placeholderClassName="text-2xl"
                    />
                  </div>
                  <div>
                    <p className={styles.driver_name}>
                      {driver.givenName} <span className="uppercase" style={{ color }}>{driver.familyName}</span>
                    </p>
                    <p className={styles.driver_meta}>
                      {driver.permanentNumber && `#${driver.permanentNumber} · `}{driver.nationality}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Seasons Section */}
        {seasons.length > 0 && (
          <div className={styles.section_bordered}>
            <h2 className={styles.section_title}>{t('team_detail.seasons_title')}</h2>
            <div className={styles.seasons_grid}>
              {seasons.map((season) => {
                const isChampion = isSeasonChampion(constructorChampions[season], team.constructorId);
                return (
                  <span key={season} className={`${styles.season_chip} ${isChampion ? styles.season_chip_champion : ''}`}>
                    {isChampion && <Trophy size={12} />}
                    {season}
                  </span>
                );
              })}
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
  panel: "bg-white dark:bg-[#151515] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 border-t-4",

  hero: "bg-gradient-to-r from-gray-900 to-black p-10 md:p-16 flex flex-col gap-10 relative overflow-hidden",
  hero_pattern: "absolute inset-0 opacity-5 pointer-events-none",
  hero_top: "z-10 flex flex-col md:flex-row items-center gap-8",
  hero_logo_wrapper: "w-28 h-28 md:w-36 md:h-36 flex-shrink-0 bg-white/5 rounded-2xl p-4 flex items-center justify-center",
  hero_logo: "max-w-full max-h-full object-contain",
  hero_info: "text-center md:text-left flex flex-col items-center md:items-start",
  hero_name: "font-orbitron text-4xl md:text-6xl font-bold text-white mb-6 leading-tight uppercase",
  hero_tags: "flex flex-wrap justify-center md:justify-start gap-3 mb-6",
  tag: "bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm font-inter",
  wiki_link: "inline-flex items-center gap-2 text-f1-red hover:text-red-400 font-inter text-sm font-semibold transition-colors",
  hero_car: "z-10 w-full max-w-3xl mx-auto object-contain drop-shadow-2xl",

  section: "p-10 md:p-16",
  section_bordered: "p-10 md:p-16 pt-0 border-t border-gray-100 dark:border-gray-800 mt-8",
  section_title: "font-orbitron text-2xl font-bold text-f1-dark dark:text-white mb-8 uppercase border-b border-gray-200 dark:border-gray-800 pb-4 pt-8",
  stats_grid: "grid grid-cols-2 md:grid-cols-5 gap-6",
  stat_card: "bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-f1-red/50 transition-colors",
  stat_value: "font-orbitron text-3xl md:text-4xl font-bold text-f1-dark dark:text-white",
  stat_label: "font-inter text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1",

  drivers_grid: "grid grid-cols-1 sm:grid-cols-2 gap-6",
  driver_card: "flex items-center gap-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-f1-red/50 transition-colors",
  driver_image_wrapper: "w-20 h-20 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5",
  driver_image: "w-full h-full object-cover object-top",
  driver_name: "font-inter font-bold text-lg text-f1-dark dark:text-white",
  driver_meta: "font-inter text-sm text-gray-500 dark:text-gray-400",

  seasons_grid: "flex flex-wrap gap-2",
  season_chip: "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-orbitron text-sm font-bold bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800",
  season_chip_champion: "!bg-[#d4a017]/15 !text-[#b8860b] dark:!text-[#ffcc00] !border-[#d4a017]/40",
};

export default TeamDetail;
