import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';

const MainLayout = () => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('PT');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.nav_content}>
          <Link to="/" className={styles.logo}>
            <img src={logoImg} alt="ApexHQ Logo" className={styles.logo_img} />
            ApexHQ
          </Link>
          <div className={styles.nav_links}>
            <Link to="/" className={styles.link}>Início</Link>
            <Link to="/calendario" className={styles.link}>Calendário</Link>
            <Link to="/pilotos" className={styles.link}>Pilotos</Link>
            <Link to="/classificacoes" className={styles.link}>Classificações</Link>
          </div>
          <div className={styles.nav_actions}>
            {/* Language Dropdown */}
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className={styles.lang_select}
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
          </div>
        </div>
      </nav>
      
      {/* Outlet */}
      <main className={styles.outlet}>
        <Outlet /> 
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        &copy; 2026 APEXHQ - F1 STATS HUB
      </footer>
    </div>
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
  lang_select: "bg-transparent border border-gray-300 dark:border-gray-600 text-sm font-orbitron rounded px-2 py-1 outline-none text-f1-dark dark:text-f1-light-gray focus:border-f1-red cursor-pointer",
  theme_toggle: "text-xl hover:scale-110 transition-transform cursor-pointer text-f1-dark dark:text-f1-light-gray",
  btn_login: "hidden sm:block px-4 py-1.5 bg-f1-red text-white text-sm font-orbitron uppercase tracking-wider rounded hover:bg-red-700 transition-colors duration-300",
  outlet: "flex-grow",
  footer: "p-6 text-center text-xs text-gray-500 dark:text-gray-400 font-orbitron border-t border-gray-200 dark:border-f1-red/10",
};  

export default MainLayout;