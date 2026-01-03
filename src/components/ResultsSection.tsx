import { TrendingUp, Rocket, Smartphone, Target, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Resultados reales
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((result, index) => (
            <div
              key={index}
              className={`glass-card p-6 text-center transition-all duration-700 hover-lift ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <result.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {result.stat}
              </div>
              <p className="text-muted-foreground text-sm">{result.label}</p>
            </div>
          ))}
        </div>

        {/* Casos de éxito CTA */}
        <div className={`mt-12 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <Link to="/casos-exito">
            <Button 
              variant="outline" 
              className="group px-6 py-3 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-3 text-primary group-hover:animate-pulse" />
              <span className="text-sm md:text-base text-foreground/80 group-hover:text-foreground transition-colors">
                ¿Necesitas inspiración? Conoce historias de éxito reales
              </span>
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3 max-w-md mx-auto">
            Descubre cómo otros negocios dieron el salto digital y multiplicaron sus ventas. ¡Sé el siguiente!
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
