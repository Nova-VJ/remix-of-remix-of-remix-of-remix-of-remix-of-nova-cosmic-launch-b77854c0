import { Link } from 'react-router-dom';
import { Search, Target, Code, TrendingUp, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import SectionHeader from '@/components/SectionHeader';
import NovaMethodIcon from '@/components/NovaMethodIcon';
import { useTranslation } from '@/i18n';

const STEP_ICONS = [Search, Target, Code, TrendingUp];

const ProcessSection = () => {
  const { t, isEn } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="proceso" ref={ref as React.RefObject<HTMLElement>} className="cv-auto relative py-20 md:py-28 px-4 sm:px-6 bg-muted/40 border-y border-border">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeader
            eyebrow={t.process.eyebrow}
            title={t.process.title}
            subtitle={t.process.subtitle}
          />
        </div>

        {/* Steps */}
        <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" aria-hidden="true" />
          {t.process.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] || Search;
            return (
              <li
                key={index}
                className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 120 + 150}ms` }}
              >
                <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {isEn ? `Step ${step.stepNumber}` : `Paso ${step.stepNumber}`}
                </p>
                <h3 className="mt-1 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            );
          })}
        </ol>

        {/* Método NOVA teaser */}
        <div
          className={`mt-16 overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-accent via-background to-background p-6 shadow-card transition-all duration-700 sm:p-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '650ms' }}
        >
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
            <div className="flex justify-center">
              <NovaMethodIcon size={96} onView />
            </div>
            <div className="text-center md:text-left">
              <p className="eyebrow mb-2">{t.process.novaMethodTeaser.eyebrow}</p>
              <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                {t.process.novaMethodTeaser.title}
              </h3>
              <p className="mt-3 max-w-xl text-muted-foreground md:mx-0 mx-auto">
                {t.process.novaMethodTeaser.description}
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                {t.process.novaMethodTeaser.phases.map((phase, i) => (
                  <li key={phase} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80">
                    <span className="text-primary font-semibold">{i + 1}</span>
                    {phase}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/metodo-nova"
              className="btn-glow inline-flex items-center justify-center gap-2 whitespace-nowrap text-primary-foreground md:self-center"
            >
              {t.process.novaMethodTeaser.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
