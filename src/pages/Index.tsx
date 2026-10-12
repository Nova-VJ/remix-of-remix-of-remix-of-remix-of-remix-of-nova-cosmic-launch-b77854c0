import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { SEO_PAGES } from "@/config/seo";
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import PackagesSection from '@/components/PackagesSection';
import ProcessSection from '@/components/ProcessSection';
import ComparisonSection from '@/components/ComparisonSection';
import ResultsSection from '@/components/ResultsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import FinalCTASection from '@/components/FinalCTASection';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import ShoppingCart from '@/components/ShoppingCart';
import Footer from '@/components/Footer';
import VirtualAssistant from '@/components/VirtualAssistant';
import AuditPopup from '@/components/AuditPopup';
import BriefingCTASection from '@/components/BriefingCTASection';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldOpenBriefing = searchParams.get('openBriefing') === 'true';

  // Clear the openBriefing param after it's been read
  useEffect(() => {
    if (shouldOpenBriefing) {
      // Remove the param from URL without refresh
      setSearchParams({}, { replace: true });
    }
  }, [shouldOpenBriefing, setSearchParams]);

  return (
    <>
      <SEOHead {...SEO_PAGES["/"]} />

      <main className="relative pb-20 md:pb-0">
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <PackagesSection />
        <ProcessSection />
        <ComparisonSection />
        <ResultsSection />
        <FAQSection />
        <BriefingCTASection autoOpen={shouldOpenBriefing} />
        <ContactSection />
        <FinalCTASection />
        <Footer />
        <StickyMobileCTA />
        <ShoppingCart />
        <VirtualAssistant />
        <AuditPopup />
      </main>
    </>
  );
};

export default Index;
