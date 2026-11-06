import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n';

// Intro band for the software side of NOVA, right before the "Proyectos" section it points to.
const SoftwareBand = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="px-4 pt-10 sm:px-6">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn(
          'relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#140b2e] px-6 py-12 text-center text-white shadow-[0_30px_80px_-30px_hsl(262_60%_30%/0.6)] transition-all duration-700 sm:px-12 md:py-16',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: 'radial-gradient(60% 80% at 15% 0%, hsl(262 83% 58% / 0.45), transparent 60%), radial-gradient(50% 70% at 90% 100%, hsl(290 80% 55% / 0.3), transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
            {t.softwareBand.titleStart}
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text pb-[0.15em] text-transparent">
              {t.softwareBand.titleGradient}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            {t.softwareBand.description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/?openBriefing=true"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-7 py-3 font-semibold text-[#140b2e] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {t.softwareBand.ctaConsultation}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#proyectos"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              {t.softwareBand.ctaDemo}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoftwareBand;
