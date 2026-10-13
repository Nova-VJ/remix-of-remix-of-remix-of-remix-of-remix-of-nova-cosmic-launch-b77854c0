import { lazy, Suspense, useEffect } from 'react';
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
import { useIdle } from '@/hooks/use-idle';
import { useSpotlight } from '@/hooks/use-spotlight';

// Widgets that aren't needed for the first paint load once the page is idle
const ShoppingCart = lazy(() => import('@/components/ShoppingCart'));
const VirtualAssistant = lazy(() => import('@/components/VirtualAssistant'));
const AuditPopup = lazy(() => import('@/components/AuditPopup'));
import StickyMobileCTA from '@/components/StickyMobileCTA';
import Footer from '@/components/Footer';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldOpenBriefing = searchParams.get('openBriefing') === 'true';
  const idle = useIdle();
  useSpotlight();

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
        <ContactSection autoOpenBriefing={shouldOpenBriefing} />
        <Footer />
        <StickyMobileCTA />
        {idle && (
          <Suspense fallback={null}>
            <ShoppingCart />
            <VirtualAssistant />
            <AuditPopup />
          </Suspense>
        )}
      </main>
    </>
  );
};

export default Index;
