import { Link, NavLink, useLocation, useOutlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';

const NAV_ITEMS = [
  { to: '/', key: 'navbar.home' },
  { to: '/calendario', key: 'navbar.calendar' },
  { to: '/pilotos', key: 'navbar.drivers' },
  { to: '/classificacoes', key: 'navbar.standings' },
];

const MainLayout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const outlet = useOutlet();
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language?.toUpperCase().substring(0, 2) || 'PT');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  // New page: close the mobile menu and start at the top, or at the #section in the URL
  useEffect(() => {
    setMenuOpen(false);
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.link_active : ''}`;

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.container}>
        {/* Navbar */}
        <nav className={styles.navbar}>
          <div className={styles.nav_content}>
            <Link to="/" className={styles.logo}>
              <img src={logoImg} alt="ApexHQ Logo" className={styles.logo_img} />
              ApexHQ
            </Link>
            <div className={styles.nav_links}>
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                  {t(item.key)}
                </NavLink>
              ))}
            </div>
            <div className={styles.nav_actions}>
              {/* Language Dropdown */}
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  i18n.changeLanguage(e.target.value.toLowerCase());
                }}
                className={styles.lang_select}
                aria-label="Idioma / Language"
              >
                <option value="PT">PT</option>
                <option value="EN">EN</option>
              </select>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={styles.theme_toggle}
                aria-label="Alternar Tema"
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              {/* Login Button */}
              <button className={styles.btn_login}>
                Login
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={styles.menu_toggle}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={styles.mobile_menu}
              >
                {NAV_ITEMS.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                    {t(item.key)}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Outlet */}
        <main className={styles.outlet}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          &copy; 2026 APEXHQ - F1 STATS HUB
        </footer>
      </div>
    </MotionConfig>
  );
};

const styles = {
  container: "min-h-screen font-inter flex flex-col",
  navbar: "bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-f1-red/30 p-4 sticky top-0 z-50 transition-colors duration-300",
  nav_content: "container mx-auto flex justify-between items-center",
  logo: "flex items-center gap-2 text-2xl font-orbitron text-f1-red font-bold uppercase italic tracking-wider",
  logo_img: "h-8 w-auto object-contain",
  nav_links: "hidden md:flex space-x-6 font-orbitron text-sm tracking-widest text-f1-dark dark:text-f1-light-gray",
  nav_actions: "flex items-center space-x-4",
  link: "hover:text-f1-red transition-colors",
  link_active: "text-f1-red",
  lang_select: "bg-transparent border border-gray-300 dark:border-gray-600 text-sm font-orbitron rounded px-2 py-1 outline-none text-f1-dark dark:text-f1-light-gray focus:border-f1-red cursor-pointer",
  theme_toggle: "text-xl hover:scale-110 transition-transform cursor-pointer text-f1-dark dark:text-f1-light-gray",
  btn_login: "hidden sm:block px-4 py-1.5 bg-f1-red text-white text-sm font-orbitron uppercase tracking-wider rounded hover:bg-red-700 transition-colors duration-300",
  menu_toggle: "md:hidden text-f1-dark dark:text-f1-light-gray hover:text-f1-red transition-colors",
  mobile_menu: "md:hidden container mx-auto flex flex-col gap-4 pt-4 overflow-hidden font-orbitron text-sm tracking-widest text-f1-dark dark:text-f1-light-gray",
  outlet: "flex-grow",
  footer: "p-6 text-center text-xs text-gray-500 dark:text-gray-400 font-orbitron border-t border-gray-200 dark:border-f1-red/10",
};

export default MainLayout;
