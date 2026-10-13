import { X, Check } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import SectionHeader from '@/components/SectionHeader';
import { cn } from '@/lib/utils';

const comparisons = [{
  others: "Diseño genérico",
  nova: "Estrategia personalizada"
}, {
  others: "Webs \"bonitas\"",
  nova: "Webs que convierten"
}, {
  others: "Sin métricas",
  nova: "Seguimiento real de resultados"
}, {
  others: "Solo entrega",
  nova: "Optimización continua"
}];

const ComparisonSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const reveal = (delay: number) => ({
    className: cn('transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'),
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="cv-auto relative py-20 md:py-28 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <div {...reveal(0)}>
          <SectionHeader eyebrow="Por qué NOVA" title="Una agencia que mide resultados, no solo entrega" />
        </div>

        <div className="grid items-center gap-5 md:grid-cols-2">
          {/* Other agencies: muted */}
          <div className={cn('rounded-3xl border border-border bg-muted/40 p-6 sm:p-8', reveal(150).className)} style={reveal(150).style}>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Otras agencias</p>
            <ul className="mt-6 space-y-4">
              {comparisons.map((row) => (
                <li key={row.others} className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <X className="h-4 w-4 text-destructive" />
                  </span>
                  {row.others}
                </li>
              ))}
            </ul>
          </div>

          {/* NOVA: elevated */}
          <div className={cn('glass-card gradient-border p-6 sm:p-9 md:scale-[1.03]', reveal(300).className)} style={reveal(300).style}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Con NOVA</p>
              <img src="/images/logo-nova-light.webp" alt="" width={77} height={36} loading="lazy" decoding="async" className="h-9 w-auto" />
            </div>
            <ul className="mt-6 space-y-4">
              {comparisons.map((row) => (
                <li key={row.nova} className="flex items-center gap-3 font-medium text-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundImage: 'var(--gradient-purple)' }}>
                    <Check className="h-4 w-4" />
                  </span>
                  {row.nova}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={cn('mt-10 text-center text-lg text-muted-foreground', reveal(500).className)} style={reveal(500).style}>
          Diseño, tecnología y estrategia <span className="font-semibold text-foreground">en un solo lugar</span>.
        </p>
      </div>
    </section>
  );
};

export default ComparisonSection;
