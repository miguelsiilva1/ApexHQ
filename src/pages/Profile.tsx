import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, User as UserIcon } from 'lucide-react';
import { AUTH_ENABLED, useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { usePageMeta } from '../hooks/usePageMeta';
import { driverImages, teamColors, teamLogos, DEFAULT_TEAM_COLOR } from '../data/f1Media';
import type { FavoriteKind } from '../types/favorites.types';

const byName = (entries: Record<string, string>) =>
  Object.entries(entries).sort((a, b) => a[1].localeCompare(b[1]));

const Profile = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading, logout } = useAuth();
  const { favorites, loading, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  usePageMeta(t('profile.title'));

  useEffect(() => {
    if (AUTH_ENABLED && !authLoading && !user) navigate('/login', { replace: true, state: { from: '/perfil' } });
  }, [authLoading, user, navigate]);

  if (!AUTH_ENABLED) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>{t('auth.unavailable')}</p>
      </div>
    );
  }

  if (authLoading || loading || !user) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const drivers = byName(favorites.drivers);
  const teams = byName(favorites.teams);

  const removeButton = (kind: FavoriteKind, id: string, name: string) => (
    <button
      onClick={() => toggleFavorite(kind, id, name).catch((err) => console.error('Failed to update favorites:', err))}
      className={styles.remove}
      aria-label={`${t('favorites.remove')}: ${name}`}
      title={t('favorites.remove')}
    >
      <Star size={18} className="fill-current" />
    </button>
  );

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.hero}>
          <div className={styles.avatar}>
            {user.photoURL
              ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              : <UserIcon size={40} />}
          </div>
          <div className="text-center md:text-left">
            <h1 className={styles.name}>{user.displayName || t('profile.title')}</h1>
            <p className={styles.email}>{user.email}</p>
          </div>
          <button onClick={logout} className={styles.logout}>{t('navbar.logout')}</button>
        </div>

        <section className={styles.section}>
          <h2 className={styles.section_title}>{t('profile.favorite_drivers')}</h2>
          {drivers.length === 0 ? (
            <p className={styles.empty}>
              {t('profile.no_drivers')} <Link to="/pilotos" className={styles.link}>{t('profile.browse')}</Link>
            </p>
          ) : (
            <div className={styles.grid}>
              {drivers.map(([id, name]) => (
                <div key={id} className={styles.card}>
                  <Link to={`/pilotos/${id}`} className={styles.card_link}>
                    <div className={styles.thumb}>
                      {driverImages[id]
                        ? <img src={driverImages[id]} alt="" className="w-full h-full object-cover object-top" />
                        : <span className={styles.initial}>{name.charAt(0)}</span>}
                    </div>
                    <span className={styles.card_name}>{name}</span>
                  </Link>
                  {removeButton('drivers', id, name)}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section_bordered}>
          <h2 className={styles.section_title}>{t('profile.favorite_teams')}</h2>
          {teams.length === 0 ? (
            <p className={styles.empty}>
              {t('profile.no_teams')} <Link to="/pilotos" className={styles.link}>{t('profile.browse')}</Link>
            </p>
          ) : (
            <div className={styles.grid}>
              {teams.map(([id, name]) => (
                <div key={id} className={styles.card} style={{ borderLeftColor: teamColors[id] || DEFAULT_TEAM_COLOR }}>
                  <Link to={`/equipas/${id}`} className={styles.card_link}>
                    <div className={styles.thumb_logo}>
                      {teamLogos[id]
                        ? <img src={teamLogos[id]} alt="" className="max-w-full max-h-full object-contain" />
                        : <span className={styles.initial}>{name.charAt(0)}</span>}
                    </div>
                    <span className={styles.card_name}>{name}</span>
                  </Link>
                  {removeButton('teams', id, name)}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: "p-4 sm:p-8 max-w-[1200px] mx-auto min-h-screen",
  loading_container: "p-8 max-w-[1200px] mx-auto min-h-screen flex items-center justify-center",
  spinner: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-f1-red",
  panel: "bg-white dark:bg-[#151515] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800",

  hero: "bg-gradient-to-r from-gray-900 to-black p-8 md:p-12 flex flex-col md:flex-row items-center gap-6",
  avatar: "w-20 h-20 rounded-full overflow-hidden bg-white/10 text-white/70 flex items-center justify-center flex-shrink-0 border-2 border-f1-red",
  name: "font-orbitron text-3xl md:text-4xl font-bold text-white uppercase",
  email: "font-inter text-gray-400 mt-1",
  logout: "md:ml-auto px-4 py-2 border border-f1-red text-f1-red font-orbitron text-xs uppercase tracking-wider rounded-lg hover:bg-f1-red hover:text-white transition-colors",

  section: "p-6 sm:p-10 md:p-12",
  section_bordered: "p-6 sm:p-10 md:p-12 border-t border-gray-100 dark:border-gray-800",
  section_title: "font-orbitron text-2xl font-bold text-f1-dark dark:text-white mb-8 border-l-4 border-f1-red pl-4 uppercase",
  empty: "font-inter text-gray-500",
  link: "text-f1-red font-semibold hover:underline",

  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  card: "flex items-center gap-2 pr-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 border-l-4 border-l-f1-red hover:border-f1-red/50 transition-colors",
  card_link: "flex-1 min-w-0 flex items-center gap-4 p-3",
  thumb: "w-16 h-16 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0",
  thumb_logo: "w-16 h-16 rounded-xl bg-white/80 dark:bg-white/5 p-2 flex items-center justify-center flex-shrink-0",
  initial: "font-orbitron text-2xl font-bold text-gray-400",
  card_name: "font-orbitron font-bold text-f1-dark dark:text-white uppercase truncate",
  remove: "p-2 text-f1-red hover:text-red-700 transition-colors",
};

export default Profile;
