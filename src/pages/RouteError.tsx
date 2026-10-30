import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';

const RouteError = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('error.page_title')}</h1>
      <p className={styles.text}>{t('error.page_msg')}</p>
      <button onClick={() => window.location.reload()} className={styles.button}>
        <RefreshCw size={18} />
        {t('error.reload')}
      </button>
    </div>
  );
};

const styles = {
  container: "min-h-screen flex flex-col items-center justify-center text-center p-8 bg-f1-light dark:bg-f1-dark",
  title: "font-orbitron text-2xl md:text-4xl font-bold text-f1-dark dark:text-white uppercase mb-4",
  text: "font-inter text-gray-600 dark:text-gray-400 mb-10 max-w-md",
  button: "flex items-center gap-2 px-8 py-3 bg-f1-red text-white font-orbitron uppercase tracking-wider rounded hover:bg-red-700 transition-colors",
};

export default RouteError;
