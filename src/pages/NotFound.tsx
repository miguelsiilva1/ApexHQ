import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../hooks/usePageMeta';

const NotFound = () => {
  const { t } = useTranslation();
  usePageMeta(t('not_found.title'));

  return (
    <div className={styles.container}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>{t('not_found.title')}</h1>
      <p className={styles.text}>{t('not_found.text')}</p>
      <Link to="/" className={styles.button}>{t('not_found.button')}</Link>
    </div>
  );
};

const styles = {
  container: "min-h-[70vh] flex flex-col items-center justify-center text-center p-8",
  code: "font-orbitron text-8xl md:text-9xl font-bold text-f1-red leading-none",
  title: "font-orbitron text-2xl md:text-4xl font-bold text-f1-dark dark:text-white uppercase mt-6 mb-4",
  text: "font-inter text-gray-600 dark:text-gray-400 mb-10 max-w-md",
  button: "px-8 py-3 bg-f1-red text-white font-orbitron uppercase tracking-wider rounded hover:bg-red-700 transition-colors",
};

export default NotFound;
