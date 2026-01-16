import { TrendingUp, Rocket, Smartphone, Target, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import casosExitoBanner from '@/assets/casos-exito-banner.png';

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

        {/* Casos de éxito CTA - Image and Text */}
        <div className={`mt-16 pt-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <Link to="/casos-exito" className="block mb-4 md:mb-6">
            <div className="relative group cursor-pointer overflow-hidden rounded-lg md:rounded-xl mx-auto max-w-[280px] sm:max-w-sm md:max-w-full">
              <img 
                src={casosExitoBanner} 
                alt="Casos de éxito - Aprende con nosotros" 
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </Link>

          <div className="text-center px-4 md:px-0">
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed font-medium">
              Aprende con nosotros, utilizamos <span className="text-primary font-semibold">historias reales</span> de ejemplo y te explicamos las estrategias que aplicaron estos comercios, para surgir de la nada, pero muchas veces también <span className="text-primary font-semibold">¡Para levantarse con más fuerza!</span>
            </p>
            <Link to="/casos-exito">
              <Button 
                size="lg"
                className="rounded-full px-8 md:px-10 text-base md:text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 border-0 font-semibold"
              >
                Ver Casos de Éxito
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
