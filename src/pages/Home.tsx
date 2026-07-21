const Home = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>A Nova Era da F1 2026</h1>
          <p className={styles.heroSubtitle}>Descobre as novas regras, os novos carros e a emoção da próxima geração do desporto motorizado.</p>
          <div className={styles.heroButtons}>
            <button className={styles.btnTransparent}>Read More</button>
            <button className={styles.btnRed}>Latest Results</button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Próximo GP */}
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

        {/* Últimas Notícias & Destaques */}
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

        {/* Sobre Nós / Call to Action */}
        <section className={styles.aboutSection}>
          <h2 className={styles.sectionTitleCenter}>Sobre a ApexHQ</h2>
          <p className={styles.aboutText}>
            A ApexHQ é o teu hub definitivo para tudo relacionado com a Fórmula 1. 
            Estatísticas detalhadas, análises de corrida, e cobertura em tempo real das temporadas.
          </p>
          <button className={styles.btnTransparentDark}>Conhecer a Equipa</button>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: "flex flex-col w-full",
  
  /* Hero */
  hero: "relative w-full h-[70vh] flex items-center justify-center bg-gradient-to-r from-gray-200 to-white dark:from-gray-900 dark:to-f1-dark overflow-hidden transition-colors duration-300",
  heroOverlay: "absolute inset-0 bg-gradient-to-br from-f1-red/10 to-transparent dark:from-black/80 dark:to-black/30 z-10 transition-colors duration-300",
  heroContent: "relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center",
  heroTitle: "font-orbitron text-5xl md:text-7xl font-bold text-f1-dark dark:text-white mb-6 tracking-tight uppercase transition-colors duration-300",
  heroSubtitle: "font-inter text-lg md:text-2xl text-gray-800 dark:text-gray-200 mb-10 max-w-2xl transition-colors duration-300",
  heroButtons: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6",
  btnTransparent: "px-8 py-3 bg-transparent border-2 border-f1-dark dark:border-white text-f1-dark dark:text-white font-orbitron uppercase tracking-wider hover:bg-f1-dark hover:text-white dark:hover:bg-white dark:hover:text-f1-dark transition-all duration-300",
  btnRed: "px-8 py-3 bg-f1-red border-2 border-f1-red text-white font-orbitron uppercase tracking-wider hover:bg-red-700 hover:border-red-700 transition-all duration-300",
  
  /* Main Content Layout */
  mainContent: "container mx-auto px-4 py-16 space-y-20",
  sectionTitle: "font-orbitron text-3xl font-bold text-f1-dark dark:text-white mb-8 border-l-4 border-f1-red pl-4 uppercase",
  sectionTitleCenter: "font-orbitron text-3xl font-bold text-f1-dark dark:text-white mb-6 uppercase",
  
  /* Next GP */
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

  /* News Grid */
  newsSection: "w-full",
  newsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
  newsCard: "bg-white dark:bg-[#151515] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-f1-red/20 transition-all duration-300 cursor-pointer group",
  newsImagePlaceholder: "h-48 w-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-900 group-hover:opacity-80 transition-opacity",
  newsCardContent: "p-6",
  newsCategory: "font-orbitron text-xs text-f1-red uppercase tracking-wider mb-2 font-bold",
  newsTitle: "font-bold text-xl text-f1-dark dark:text-white mb-3 font-inter",
  newsExcerpt: "font-inter text-gray-600 dark:text-gray-400 text-sm line-clamp-3",
  
  /* About Section */
  aboutSection: "w-full bg-white dark:bg-[#151515] p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 text-center transition-colors duration-300",
  aboutText: "font-inter text-f1-dark dark:text-gray-300 max-w-3xl mx-auto mb-8 text-lg",
  btnTransparentDark: "px-8 py-3 bg-transparent border-2 border-f1-dark dark:border-white text-f1-dark dark:text-white font-orbitron uppercase tracking-wider hover:bg-f1-dark hover:text-white dark:hover:bg-white dark:hover:text-f1-dark transition-all duration-300",
};

export default Home;