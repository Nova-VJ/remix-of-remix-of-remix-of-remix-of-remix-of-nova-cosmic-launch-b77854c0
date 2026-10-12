import { TrendingUp, Rocket, Smartphone, Target, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import casosExitoBanner from '@/assets/casos-exito-banner.webp';
import SectionHeader from '@/components/SectionHeader';

const results = [
  {
    icon: TrendingUp,
    stat: "+120%",
    label: "generación de leads"
  },
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

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden bg-muted/40 border-y border-border">

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeader eyebrow="Resultados" title="Lo que conseguimos para nuestros clientes" className="mb-0" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((result, index) => (
            <div
              key={index}
              className={`glass-card p-6 text-center transition-all duration-700 hover-lift ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                <result.icon className="h-5 w-5" />
              </span>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {result.stat}
              </div>
              <p className="text-muted-foreground text-sm">{result.label}</p>
            </div>
          ))}
        </div>

        {/* Casos de éxito CTA - Image and Text */}
        <div className={`mt-16 glass-card grid items-center gap-8 p-6 md:grid-cols-2 md:p-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
          <Link to="/casos-exito" className="block">
            <div className="relative group cursor-pointer overflow-hidden rounded-xl border border-border">
              <img 
                src={casosExitoBanner} 
                alt="Casos de éxito - Aprende con nosotros"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
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
