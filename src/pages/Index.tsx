import { useState, useEffect } from 'react';
import IntroSection from '@/components/IntroSection';
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
import Footer from '@/components/Footer';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);

  useEffect(() => {
    setMainVisible(true);
  }, []);

  const handleIntroEnd = () => {
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroSection onIntroEnd={handleIntroEnd} />}

      <main className={`relative pb-20 md:pb-0 transition-opacity duration-500 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <HeroSection />
        <ServicesSection />
        <PackagesSection />
        <ProcessSection />
        <ComparisonSection />
        <ResultsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <TrustSection />
        <FinalCTASection />
        <Footer />
        <StickyMobileCTA />
      </main>
    </>
  );
};

export default Index;
