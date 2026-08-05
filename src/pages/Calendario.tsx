import { useTranslation } from 'react-i18next';

const Calendario = () => {
  const { t } = useTranslation();
  return (
    <div className = {styles.container}>
      <h1 className = {styles.page_header}> {t('calendar.title')}</h1>
      <p className = {styles.page_title}> {t('calendar.subtitle')}</p>
    </div>
  );
};

const styles = {
  container : "p-8",
  page_header : "font-orbitron text-4xl text-f1-red mb-4",
  page_title : "font-inter",
};

export default Calendario;