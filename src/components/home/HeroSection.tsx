import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import hero1 from '../../assets/hero/1.jpg';
import hero2 from '../../assets/hero/2.jpg';
import hero3 from '../../assets/hero/3.jpg';
import hero4 from '../../assets/hero/4.jpg';
import hero5 from '../../assets/hero/5.jpg';

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const images = [hero1, hero2, hero3, hero4, hero5];
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 7500); 
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section 
      className={styles.hero}
      style={{ backgroundImage: `url(${images[currentImgIndex]})` }}
    >
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
        <p className={styles.heroSubtitle}>{t('hero.subtitle')}</p>
        <div className={styles.heroButtons}>
          <button 
            className={styles.btnTransparent}
            onClick={() => scrollToSection('news-section')}
          >
            {t('hero.read_more')}
          </button>
          <button 
            className={styles.btnRed}
            onClick={() => navigate('/resultados')}
          >
            {t('hero.latest_results')}
          </button>
        </div>
      </div>
    </section>
  );
};

const styles = {
  hero: "relative w-full h-[70vh] flex items-center justify-center bg-gray-900 overflow-hidden bg-cover bg-center transition-[background-image] duration-1000 ease-in-out",
  heroOverlay: "absolute inset-0 bg-black/50 dark:bg-black/60 z-10 transition-colors duration-300",
  heroContent: "relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center",
  heroTitle: "font-orbitron text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight uppercase transition-colors duration-300 drop-shadow-lg",
  heroSubtitle: "font-inter text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl transition-colors duration-300 drop-shadow-md",
  heroButtons: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6",
  btnTransparent: "px-8 py-3 bg-transparent border-2 border-white text-white font-orbitron uppercase tracking-wider hover:bg-white hover:text-f1-dark transition-all duration-300",
  btnRed: "px-8 py-3 bg-f1-red border-2 border-f1-red text-white font-orbitron uppercase tracking-wider hover:bg-red-700 hover:border-red-700 transition-all duration-300",
};

export default HeroSection;
