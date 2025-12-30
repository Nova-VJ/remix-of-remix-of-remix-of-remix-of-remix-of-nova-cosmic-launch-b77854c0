import { X, Check } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const comparisons = [
  { others: "Diseño genérico", nova: "Estrategia personalizada" },
  { others: "Webs \"bonitas\"", nova: "Webs que convierten" },
  { others: "Sin métricas", nova: "Seguimiento real de resultados" },
  { others: "Solo entrega", nova: "Optimización continua" },
];

const ComparisonSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            ¿Por qué Solutions Nova?
          </h2>
        </div>

        {/* Comparison table */}
        <div className={`glass-card overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '200ms' }}>
          {/* Header */}
          <div className="grid grid-cols-2 border-b border-border/30">
            <div className="p-4 text-center text-muted-foreground font-medium">
              Otras agencias
            </div>
            <div className="p-4 text-center text-primary font-bold bg-primary/5">
              Solutions Nova
            </div>
          </div>

          {/* Rows */}
          {comparisons.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-2 border-b border-border/20 last:border-b-0 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              <div className="p-4 flex items-center gap-3 text-muted-foreground">
                <X className="w-5 h-5 text-destructive flex-shrink-0" />
                <span className="text-sm">{row.others}</span>
              </div>
              <div className="p-4 flex items-center gap-3 bg-primary/5">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{row.nova}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className={`text-center text-muted-foreground mt-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '700ms' }}>
          Diseño, tecnología y estrategia en un solo lugar.
        </p>
      </div>
    </section>
  );
};

export default ComparisonSection;
