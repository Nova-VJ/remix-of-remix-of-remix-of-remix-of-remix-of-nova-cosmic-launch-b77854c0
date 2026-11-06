import { TrendingUp, Rocket, Smartphone, Target, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import casosExitoBanner from '@/assets/casos-exito-banner.webp';
import SectionHeader from '@/components/SectionHeader';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n';

const RESULT_ICONS = [Rocket, Smartphone, Target];

const ResultsSection = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const reveal = (delay: number) => ({
    className: cn('transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'),
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="cv-auto relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden bg-muted/40 border-y border-border">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div {...reveal(0)}>
          <SectionHeader eyebrow={t.results.eyebrow} title={t.results.title} />
        </div>

        {/* Bento grid: one headline result, three supporting ones */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2">
          <div
            className={cn('relative col-span-2 overflow-hidden rounded-3xl p-7 text-white sm:p-9 lg:row-span-2', reveal(150).className)}
            style={{ ...reveal(150).style, backgroundImage: 'var(--gradient-cosmic)' }}
          >
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(262_85%_65%/0.45),transparent_65%)]" aria-hidden="true" />
            <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" aria-hidden="true" />
            <div className="relative flex h-full flex-col">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <TrendingUp className="h-5 w-5 text-violet-200" />
              </span>
              <p className="mt-8 font-display text-6xl font-extrabold tracking-tight sm:text-7xl">{t.results.leadStat}</p>
              <p className="mt-2 text-lg text-white/75">{t.results.leadLabel}</p>

              {/* Decorative growth line */}
              <svg viewBox="0 0 300 90" className="mt-auto h-24 w-full pt-6" aria-hidden="true">
                <defs>
                  <linearGradient id="results-line" x1="0" x2="1">
                    <stop offset="0%" stopColor="hsl(262 85% 72%)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="hsl(262 85% 80%)" />
                  </linearGradient>
                  <linearGradient id="results-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(262 85% 70%)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="hsl(262 85% 70%)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 80 C 40 76, 60 66, 90 68 S 140 50, 170 46 S 220 30, 250 22 S 285 8, 300 4 L300 90 L0 90 Z" fill="url(#results-area)" />
                <path d="M0 80 C 40 76, 60 66, 90 68 S 140 50, 170 46 S 220 30, 250 22 S 285 8, 300 4" fill="none" stroke="url(#results-line)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="300" cy="4" r="4" fill="white" />
              </svg>
            </div>
          </div>

          {t.results.items.map((result, index) => {
            const Icon = RESULT_ICONS[index] || Rocket;
            return (
              <div
                key={result.stat}
                className={cn(
                  'glass-card spotlight hover-lift p-6',
                  index === 0 && 'col-span-2',
                  reveal(index * 100 + 250).className
                )}
                style={reveal(index * 100 + 250).style}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-foreground">{result.stat}</p>
                <p className="mt-1 text-sm text-muted-foreground">{result.label}</p>
              </div>
            );
          })}
        </div>

        {/* Casos de éxito CTA - Image and Text */}
        <div className={cn('mt-6 glass-card grid items-center gap-8 p-6 md:grid-cols-2 md:p-8', reveal(600).className)} style={reveal(600).style}>
          <Link to="/casos-exito" className="block">
            <div className="relative group cursor-pointer overflow-hidden rounded-xl border border-border">
              <img
                src={casosExitoBanner}
                alt={t.results.caseStudiesCta.title}
                width={700}
                height={400}
                loading="lazy"
                decoding="async"
                className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-sm font-medium text-primary flex items-center gap-1">
                  {t.results.caseStudiesCta.button} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium w-fit mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              {t.results.caseStudiesCta.badge}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              {t.results.caseStudiesCta.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {t.results.caseStudiesCta.description}
            </p>
            <Button asChild className="w-fit">
              <Link to="/casos-exito">
                {t.results.caseStudiesCta.button}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
