import { Search, Target, Code, TrendingUp } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import SectionHeader from '@/components/SectionHeader';

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
    <section id="proceso" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 md:py-28 px-4 sm:px-6 bg-muted/40 border-y border-border">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeader
            eyebrow="Proceso"
            title="Cómo trabajamos"
            subtitle="Un proceso claro, con un responsable que te acompaña de principio a fin."
          />
        </div>

        {/* Steps */}
        <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" aria-hidden="true" />
          {steps.map((step, index) => (
            <li
              key={index}
              className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 120 + 150}ms` }}
            >
              <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paso {step.number}</p>
              <h3 className="mt-1 text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProcessSection;
