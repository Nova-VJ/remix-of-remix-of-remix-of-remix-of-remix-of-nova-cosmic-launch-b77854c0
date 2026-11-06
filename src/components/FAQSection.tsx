import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Plus } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n';
import { WHATSAPP_URL } from '@/config/env';

const FAQSection = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  const reveal = (delay: number) => ({
    className: cn('transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'),
    style: { transitionDelay: `${delay}ms` },
  });

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  });

  return (
    <section id="faq" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 md:py-28 px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Intro, sticky on desktop */}
        <div className={cn('lg:sticky lg:top-28 lg:self-start', reveal(0).className)} style={reveal(0).style}>
          <p className="eyebrow mb-3">{t.faq.eyebrow}</p>
          <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{t.faq.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t.faq.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-glow-sm inline-flex items-center justify-center gap-2 whitespace-nowrap text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
              {t.faq.ctaTellUs}
            </a>
            <button
              type="button"
              onClick={() => navigate('/?openBriefing=true')}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border bg-card px-6 py-3 font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
            >
              {t.faq.ctaQuote}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Questions */}
        <div className={cn('glass-card divide-y divide-border', reveal(150).className)} style={reveal(150).style}>
          {t.faq.items.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.question}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-muted/40 sm:px-6"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                  >
                    <span className="font-semibold tracking-normal text-foreground">{faq.question}</span>
                    <span
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-transform duration-200',
                        open && 'rotate-45 text-primary border-primary/40 bg-accent'
                      )}
                      aria-hidden="true"
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  className={cn(
                    'grid transition-all duration-300 ease-in-out',
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="whitespace-pre-line px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
