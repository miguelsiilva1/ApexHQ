const NewsSection = () => {
  return (
    <section className={styles.newsSection}>
      <h2 className={styles.sectionTitle}>Destaques & Últimas Notícias</h2>
      <div className={styles.newsGrid}>
        {[1, 2, 3].map((item) => (
          <div key={item} className={styles.newsCard}>
            <div className={styles.newsImagePlaceholder}></div>
            <div className={styles.newsCardContent}>
              <p className={styles.newsCategory}>Regulamentos</p>
              <h3 className={styles.newsTitle}>O que muda nos motores em 2026?</h3>
              <p className={styles.newsExcerpt}>Uma análise profunda aos novos regulamentos que prometem revolucionar a grelha de partida para a próxima geração.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  sectionTitle: "font-orbitron text-3xl font-bold text-f1-dark dark:text-white mb-8 border-l-4 border-f1-red pl-4 uppercase",
  newsSection: "w-full",
  newsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
  newsCard: "bg-white dark:bg-[#151515] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-f1-red/20 transition-all duration-300 cursor-pointer group",
  newsImagePlaceholder: "h-48 w-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-900 group-hover:opacity-80 transition-opacity",
  newsCardContent: "p-6",
  newsCategory: "font-orbitron text-xs text-f1-red uppercase tracking-wider mb-2 font-bold",
  newsTitle: "font-bold text-xl text-f1-dark dark:text-white mb-3 font-inter",
  newsExcerpt: "font-inter text-gray-600 dark:text-gray-400 text-sm line-clamp-3",
};

export default NewsSection;
