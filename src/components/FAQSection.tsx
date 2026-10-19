import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Plus } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const faqs = [{
  question: "¿Qué incluye el Plan Web de 25,99 €/mes?",
  answer: "Tu web profesional a medida con tu marca (branding), un asistente virtual que atiende a tus clientes 24/7, correo profesional con tu dominio, dominio, alojamiento y certificado de seguridad, mantenimiento y 1 cambio al mes (no acumulable). El precio lleva el IVA incluido y no hay permanencia: te das de baja cuando quieras. Primero evaluamos tu proyecto sin compromiso: pídelo por el formulario o por WhatsApp. El código NOVA20 no se aplica a la suscripción."
}, {
  question: "¿Cuánto tiempo tarda cada servicio?",
  answer: "Plazos estimados:\n• Web Pro: 2–4 semanas\n• Branding Pro: 7–10 días\n• Contenido mensual: comienza en 5 días\n• App MVP: 4–8 semanas"
}, {
  question: "¿Puedo contratar solo un servicio?",
  answer: "Sí. Puedes contratar un solo servicio o combinar varios según tus necesidades."
}, {
  question: "¿Trabajáis con todo tipo de negocios?",
  answer: "Sí. Trabajamos con negocios locales, marcas personales, startups y empresas digitales."
}, {
  question: "¿Qué pasa después de empezar?",
  answer: "Analizamos tu proyecto, definimos la estrategia, desarrollamos la solución y la optimizamos continuamente con un seguimiento claro."
}, {
  question: "¿Qué necesito para empezar?",
  answer: "Muy poco:\n• Una idea de negocio (aunque no esté del todo definida)\n• Un objetivo claro\n• Las ganas de crecer\n\nNosotros te ayudamos a estructurar todo lo demás."
}, {
  question: "¿Se puede ampliar el proyecto después?",
  answer: "Sí. Todos los proyectos están diseñados para crecer: nuevas funcionalidades, más contenido, mejoras o automatización."
}, {
  question: "¿Puedo pedir una propuesta sin compromiso?",
  answer: "Por supuesto. Respondemos en 24 horas con una propuesta personalizada."
}];

// Structured data so search engines and AI assistants can read the answers
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

const FAQSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  const reveal = (delay: number) => ({
    className: cn('transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'),
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section id="faq" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 md:py-28 px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Intro, sticky on desktop */}
        <div className={cn('lg:sticky lg:top-28 lg:self-start', reveal(0).className)} style={reveal(0).style}>
          <p className="eyebrow mb-3">FAQ</p>
          <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">Preguntas frecuentes</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Lo que más nos preguntan antes de empezar. ¿Tienes otra duda? Escríbenos y te respondemos en 24 h.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
            <a href={WHATSAPP_GENERAL} target="_blank" rel="noopener noreferrer" className="btn-glow-sm inline-flex items-center justify-center gap-2 whitespace-nowrap text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
              Cuéntanos tu proyecto
            </a>
            <button
              type="button"
              onClick={() => navigate('/?openBriefing=true')}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border bg-card px-6 py-3 font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
            >
              Pide presupuesto
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Questions */}
        <div className={cn('glass-card divide-y divide-border', reveal(150).className)} style={reveal(150).style}>
          {faqs.map((faq, index) => {
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
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                        open ? 'rotate-45 border-primary bg-primary text-primary-foreground' : 'border-border text-primary'
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                {/* grid-rows 0fr -> 1fr animates to the content's real height */}
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  aria-hidden={!open}
                  className={cn('grid transition-[grid-template-rows] duration-300 ease-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
                >
                  <div className="overflow-hidden">
                    <p className="whitespace-pre-line px-5 pb-5 leading-relaxed text-muted-foreground sm:px-6">{faq.answer}</p>
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
