import HeroSection from '../components/home/HeroSection';
import NextGpSection from '../components/home/NextGpSection';
import NewsSection from '../components/home/NewsSection';
import AboutSection from '../components/home/AboutSection';

const Home = () => {
  return (
    <div className={styles.container}>
      <HeroSection />

      <div className={styles.mainContent}>
        <NextGpSection />
        <NewsSection />
        <AboutSection />
      </div>
    </div>
  );
};

const styles = {
  container: "flex flex-col w-full",
  mainContent: "container mx-auto px-4 py-16 space-y-20",
};

export default Home;