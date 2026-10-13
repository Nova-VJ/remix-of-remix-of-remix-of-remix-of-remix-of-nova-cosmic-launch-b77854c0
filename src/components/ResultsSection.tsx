import { TrendingUp, Rocket, Smartphone, Target, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import casosExitoBanner from '@/assets/casos-exito-banner.webp';
import SectionHeader from '@/components/SectionHeader';
import { cn } from '@/lib/utils';

const results = [
  {
    icon: Rocket,
    stat: "<10 días",
    label: "webs optimizadas"
  },
  {
    icon: Smartphone,
    stat: "Apps",
    label: "publicadas en App Store y Google Play"
  },
  {
    icon: Target,
    stat: "Marcas",
    label: "listas para escalar"
  },
];

const ResultsSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const reveal = (delay: number) => ({
    className: cn('transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'),
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="cv-auto relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden bg-muted/40 border-y border-border">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div {...reveal(0)}>
          <SectionHeader eyebrow="Resultados" title="Lo que conseguimos para nuestros clientes" />
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
              <p className="mt-8 font-display text-6xl font-extrabold tracking-tight sm:text-7xl">+120%</p>
              <p className="mt-2 text-lg text-white/75">generación de leads</p>

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

          {results.map((result, index) => (
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
                <result.icon className="h-5 w-5" />
              </span>
              <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-foreground">{result.stat}</p>
              <p className="mt-1 text-sm text-muted-foreground">{result.label}</p>
            </div>
          ))}
        </div>

        {/* Casos de éxito CTA - Image and Text */}
        <div className={cn('mt-6 glass-card grid items-center gap-8 p-6 md:grid-cols-2 md:p-8', reveal(600).className)} style={reveal(600).style}>
          <Link to="/casos-exito" className="block">
            <div className="relative group cursor-pointer overflow-hidden rounded-xl border border-border">
              <img
                src={casosExitoBanner}
                alt="Casos de éxito - Aprende con nosotros"
                width={960}
                height={640}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>

          <div>
            <p className="eyebrow mb-3">Casos de éxito</p>
            <h3 className="text-2xl font-bold text-foreground">Aprende de marcas que lo hicieron bien</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Analizamos historias reales de negocios que crecieron con estrategia digital y te contamos qué hicieron y cómo aplicarlo al tuyo.
            </p>
            <Link to="/casos-exito" className="mt-6 inline-block">
              <Button size="lg" className="font-semibold">
                Ver casos de éxito
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
