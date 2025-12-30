import { Search, Target, Code, TrendingUp } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const steps = [
  {
    icon: Search,
    number: "1",
    title: "Análisis",
    description: "Estudiamos tu negocio e identificamos oportunidades."
  },
  {
    icon: Target,
    number: "2",
    title: "Estrategia",
    description: "Definimos la mejor solución para tus objetivos."
  },
  {
    icon: Code,
    number: "3",
    title: "Desarrollo",
    description: "Diseñamos y construimos pensando en conversión."
  },
  {
    icon: TrendingUp,
    number: "4",
    title: "Optimización",
    description: "Medimos, ajustamos y mejoramos resultados."
  },
];

const ProcessSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Cómo trabajamos
          </h2>
          <p className="text-muted-foreground text-lg">
            Un proceso claro y sencillo
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`glass-card p-6 text-center transition-all duration-700 hover-lift ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 150 + 200}ms` }}
            >
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
