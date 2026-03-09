import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import HeroSection from '../components/sections/HeroSection';
import ExploreCryptoSection from '../components/sections/ExploreCryptoSection';
import AdvancedTraderSection from '../components/sections/AdvancedTraderSection';
import CoinbaseOneSection from '../components/sections/CoinbaseOneSection';
import BaseAppSection from '../components/sections/BaseAppSection';
import LearnSection from '../components/sections/LearnSection';
import TakeControlSection from '../components/sections/TakeControlSection';

const Home = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <HeroSection />
      <ExploreCryptoSection />
      <AdvancedTraderSection />
      <CoinbaseOneSection />
      <BaseAppSection />
      <LearnSection />
      <TakeControlSection />
    </main>
    <Footer />
  </div>
);

export default Home;
