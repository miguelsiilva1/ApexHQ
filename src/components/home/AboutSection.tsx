import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.aboutSection}>
      <h2 className={styles.sectionTitleCenter}>{t('about.title')}</h2>
      <p className={styles.aboutText}>
        {t('about.text')}
      </p>
      <a href="#" className={styles.btnTransparentDark}>{t('about.button')}</a>
    </section>
  );
};

const styles = {
  sectionTitleCenter: "font-orbitron text-3xl font-bold text-f1-dark dark:text-white mb-6 uppercase",
  aboutSection: "w-full bg-white dark:bg-[#151515] p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-center transition-colors duration-300",
  aboutText: "font-inter text-f1-dark dark:text-gray-300 max-w-3xl mx-auto mb-8 text-lg",
  btnTransparentDark: "inline-block px-8 py-3 bg-transparent border-2 border-f1-dark dark:border-white text-f1-dark dark:text-white font-orbitron uppercase tracking-wider hover:bg-f1-dark hover:text-white dark:hover:bg-white dark:hover:text-f1-dark transition-all duration-300",
};

export default AboutSection;
