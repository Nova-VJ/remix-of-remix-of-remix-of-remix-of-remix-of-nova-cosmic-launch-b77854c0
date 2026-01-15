import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import IntroSection from '@/components/IntroSection';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import PackagesSection from '@/components/PackagesSection';
import ProcessSection from '@/components/ProcessSection';
import ComparisonSection from '@/components/ComparisonSection';
import ResultsSection from '@/components/ResultsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import TrustSection from '@/components/TrustSection';
import FinalCTASection from '@/components/FinalCTASection';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import ShoppingCart from '@/components/ShoppingCart';
import Footer from '@/components/Footer';
import VirtualAssistant from '@/components/VirtualAssistant';
import ReferralPopup from '@/components/ReferralPopup';
import BriefingCTASection from '@/components/BriefingCTASection';
import ThemeToggle from '@/components/ThemeToggle';

const INTRO_LAST_SEEN_KEY = 'intro_last_seen';
const INTRO_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldOpenBriefing = searchParams.get('openBriefing') === 'true';
  
  const [showIntro, setShowIntro] = useState(() => {
    // Skip intro if coming from auth redirect
    if (shouldOpenBriefing) return false;
    const lastSeen = localStorage.getItem(INTRO_LAST_SEEN_KEY);
    if (!lastSeen) return true; // First visit, show intro
    const elapsed = Date.now() - parseInt(lastSeen);
    return elapsed >= INTRO_INTERVAL_MS; // Show again if 5+ minutes passed
  });
  const [mainVisible, setMainVisible] = useState(false);

  useEffect(() => {
    setMainVisible(true);
  }, []);

  // Clear the openBriefing param after it's been read
  useEffect(() => {
    if (shouldOpenBriefing) {
      // Remove the param from URL without refresh
      setSearchParams({}, { replace: true });
    }
  }, [shouldOpenBriefing, setSearchParams]);

  const handleIntroEnd = () => {
    localStorage.setItem(INTRO_LAST_SEEN_KEY, Date.now().toString());
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroSection onIntroEnd={handleIntroEnd} />}

      <main className={`relative pb-20 md:pb-0 transition-opacity duration-500 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <PackagesSection />
        <ProcessSection />
        <ComparisonSection />
        <ResultsSection />
        <TestimonialsSection />
        <FAQSection />
        <BriefingCTASection autoOpen={shouldOpenBriefing} />
        <ContactSection />
        <TrustSection />
        <FinalCTASection />
        <Footer />
        <StickyMobileCTA />
        <ShoppingCart />
        <VirtualAssistant />
        <ReferralPopup />
        <ThemeToggle variant="floating" />
      </main>
    </>
  );
};

export default Index;
