const HeroSection = () => {
  return (
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
  );
};

const styles = {
  hero: "relative w-full h-[70vh] flex items-center justify-center bg-gradient-to-r from-gray-200 to-white dark:from-gray-900 dark:to-f1-dark overflow-hidden transition-colors duration-300",
  heroOverlay: "absolute inset-0 bg-gradient-to-br from-f1-red/10 to-transparent dark:from-black/80 dark:to-black/30 z-10 transition-colors duration-300",
  heroContent: "relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center",
  heroTitle: "font-orbitron text-5xl md:text-7xl font-bold text-f1-dark dark:text-white mb-6 tracking-tight uppercase transition-colors duration-300",
  heroSubtitle: "font-inter text-lg md:text-2xl text-gray-800 dark:text-gray-200 mb-10 max-w-2xl transition-colors duration-300",
  heroButtons: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6",
  btnTransparent: "px-8 py-3 bg-transparent border-2 border-f1-dark dark:border-white text-f1-dark dark:text-white font-orbitron uppercase tracking-wider hover:bg-f1-dark hover:text-white dark:hover:bg-white dark:hover:text-f1-dark transition-all duration-300",
  btnRed: "px-8 py-3 bg-f1-red border-2 border-f1-red text-white font-orbitron uppercase tracking-wider hover:bg-red-700 hover:border-red-700 transition-all duration-300",
};

export default HeroSection;
