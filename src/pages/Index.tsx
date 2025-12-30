import { useState, useEffect } from 'react';
import IntroSection from '@/components/IntroSection';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import TrustSection from '@/components/TrustSection';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import Footer from '@/components/Footer';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);

  useEffect(() => {
    // Start rendering main content immediately but hidden
    setMainVisible(true);
  }, []);

  const handleIntroEnd = () => {
    setShowIntro(false);
  };

  return (
    <>
      {/* Intro Video Overlay */}
      {showIntro && <IntroSection onIntroEnd={handleIntroEnd} />}

      {/* Main Content - always rendered for smoother transition */}
      <main className={`relative pb-20 md:pb-0 transition-opacity duration-500 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <HeroSection />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
        <TrustSection />
        <Footer />
        <StickyMobileCTA />
      </main>
    </>
  );
};

export default Index;
