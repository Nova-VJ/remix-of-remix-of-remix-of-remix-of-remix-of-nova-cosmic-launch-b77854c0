import { lazy, Suspense, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { scrollToSectionId } from '@/lib/scroll';
import SEOHead from '@/components/SEOHead';
import { SEO_PAGES } from "@/config/seo";
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import OwnSystemSection from '@/components/OwnSystemSection';
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
const WelcomeGuide = lazy(() => import('@/components/WelcomeGuide'));
import StickyMobileCTA from '@/components/StickyMobileCTA';
import Footer from '@/components/Footer';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldOpenBriefing = searchParams.get('openBriefing') === 'true';
  const idle = useIdle();
  const { hash } = useLocation();

  // Links such as /#servicios from other pages: scroll once the sections exist
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => scrollToSectionId(id));
    return () => cancelAnimationFrame(frame);
  }, [hash]);
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
        <OwnSystemSection />
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
            <WelcomeGuide />
          </Suspense>
        )}
      </main>
    </>
  );
};

export default Index;
