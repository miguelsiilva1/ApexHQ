import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, User, Users } from 'lucide-react';
import { useF1Directory } from '../../hooks/useF1Directory';

const MAX_RESULTS = 8;

// Removes accents so "hakkinen" finds "Häkkinen"
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const DriverSearch = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { directory, loading, error } = useF1Directory(active);

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!directory || term.length < 2) return [];

    const drivers = directory.drivers
      .filter((d) => normalize(`${d.givenName} ${d.familyName}`).includes(term))
      .map((d) => ({ key: `d-${d.driverId}`, to: `/pilotos/${d.driverId}`, label: `${d.givenName} ${d.familyName}`, meta: d.nationality, isTeam: false }));
    const teams = directory.constructors
      .filter((c) => normalize(c.name).includes(term))
      .map((c) => ({ key: `c-${c.constructorId}`, to: `/equipas/${c.constructorId}`, label: c.name, meta: c.nationality, isTeam: true }));

    return [...drivers, ...teams].slice(0, MAX_RESULTS);
  }, [directory, query]);

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div className={styles.wrapper}>
      <Search size={18} className={styles.icon} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { setActive(true); setOpen(true); }}
        // Delay so a click on a result registers before the dropdown closes
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={t('drivers.search_placeholder')}
        className={styles.input}
      />

      {showDropdown && (
        <div className={styles.dropdown}>
          {loading && <p className={styles.message}>{t('drivers.search_loading')}</p>}
          {error && <p className={styles.message}>{t('drivers.search_error')}</p>}
          {directory && results.length === 0 && <p className={styles.message}>{t('drivers.search_empty')}</p>}
          {results.map((result) => (
            <Link key={result.key} to={result.to} className={styles.result}>
              {result.isTeam ? <Users size={16} className="text-f1-red" /> : <User size={16} className="text-f1-red" />}
              <span className={styles.result_label}>{result.label}</span>
              <span className={styles.result_meta}>{result.meta}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: "relative w-full md:w-80",
  icon: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",
  input: "w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 text-f1-dark dark:text-white font-inter py-2 pl-10 pr-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-f1-red focus:border-transparent transition-all",
  dropdown: "absolute z-20 mt-2 w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl overflow-hidden",
  message: "px-4 py-3 text-sm text-gray-500 font-inter",
  result: "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors border-b last:border-b-0 border-gray-100 dark:border-gray-800",
  result_label: "font-inter font-semibold text-f1-dark dark:text-white flex-grow truncate",
  result_meta: "font-inter text-xs text-gray-500 flex-shrink-0",
};

export default DriverSearch;
