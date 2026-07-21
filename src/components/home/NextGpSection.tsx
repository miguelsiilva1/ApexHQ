const NextGpSection = () => {
  return (
    <section className={styles.nextGpSection}>
      <h2 className={styles.sectionTitle}>Próximo GP</h2>
      <div className={styles.nextGpContainer}>
        <div className={styles.nextGpCard}>
          <div className={styles.gpHeader}>
            <h3 className={styles.gpName}>GP do Bahrain</h3>
            <p className={styles.gpDate}>28 Fev - 02 Mar, 2026</p>
          </div>
          <div className={styles.gpSessions}>
            <div className={styles.session}>
              <span className={styles.sessionName}>Treino Livre 1</span>
              <span className={styles.sessionTime}>Sex 11:30</span>
            </div>
            <div className={styles.session}>
              <span className={styles.sessionName}>Treino Livre 2</span>
              <span className={styles.sessionTime}>Sex 15:00</span>
            </div>
            <div className={styles.session}>
              <span className={styles.sessionName}>Qualificação</span>
              <span className={styles.sessionTime}>Sáb 15:00</span>
            </div>
            <div className={styles.session}>
              <span className={styles.sessionName}>Corrida</span>
              <span className={styles.sessionTime}>Dom 15:00</span>
            </div>
          </div>
        </div>

        <div className={styles.nextGpTrackContainer}>
          <div className={styles.nextGpTrackPlaceholder}>
            <span className={styles.trackPlaceholderText}>Ver Detalhes da Pista</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  sectionTitle: "font-orbitron text-3xl font-bold text-f1-dark dark:text-white mb-8 border-l-4 border-f1-red pl-4 uppercase",
  nextGpSection: "w-full",
  nextGpContainer: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch",
  nextGpCard: "bg-white dark:bg-[#151515] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden w-full flex flex-col transition-colors duration-300",
  gpHeader: "bg-gradient-to-r from-f1-red to-red-800 p-6 text-white",
  gpName: "font-orbitron text-2xl font-bold uppercase",
  gpDate: "font-inter text-sm opacity-90",
  gpSessions: "p-6 space-y-4 font-inter text-f1-dark dark:text-f1-light-gray flex-grow",
  session: "flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3 last:border-0 last:pb-0",
  sessionName: "font-medium",
  sessionTime: "font-orbitron text-f1-red font-bold",
  nextGpTrackContainer: "w-full h-full min-h-[300px] rounded-xl overflow-hidden cursor-pointer group shadow-xl border border-gray-200 dark:border-gray-800 transition-colors duration-300",
  nextGpTrackPlaceholder: "w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center transition-transform duration-500 group-hover:scale-105",
  trackPlaceholderText: "font-orbitron text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase opacity-50 group-hover:opacity-100 transition-opacity duration-300",
};

export default NextGpSection;
