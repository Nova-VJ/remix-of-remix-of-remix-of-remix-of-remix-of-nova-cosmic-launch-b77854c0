import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const faqs = [
  {
    question: "¿Cuánto tiempo tarda cada servicio?",
    answer: "Plazos estimados:\n• Web Pro: 2–4 semanas\n• Branding Pro: 7–10 días\n• Contenido mensual: comienza en 5 días\n• App MVP: 4–8 semanas"
  },
  {
    question: "¿Puedo contratar solo un servicio?",
    answer: "Sí. Puedes contratar un solo servicio o combinar varios según tus necesidades."
  },
  {
    question: "¿Trabajáis con todo tipo de negocios?",
    answer: "Sí. Trabajamos con negocios locales, marcas personales, startups y empresas digitales."
  },
  {
    question: "¿Qué pasa después de empezar?",
    answer: "Analizamos tu proyecto, definimos la estrategia, desarrollamos la solución y la optimizamos continuamente con un seguimiento claro."
  },
  {
    question: "¿Qué necesito para empezar?",
    answer: "Muy poco:\n• Una idea de negocio (aunque no esté del todo definida)\n• Un objetivo claro\n• Las ganas de crecer\n\nNosotros te ayudamos a estructurar todo lo demás."
  },
  {
    question: "¿Se puede ampliar el proyecto después?",
    answer: "Sí. Todos los proyectos están diseñados para crecer: nuevas funcionalidades, más contenido, mejoras o automatización."
  },
  {
    question: "¿Trabajáis con contrato y factura?",
    answer: "Sí. Cada proyecto incluye una propuesta clara, condiciones definidas y facturación."
  },
  {
    question: "¿Puedo pedir una propuesta sin compromiso?",
    answer: "Por supuesto. Respondemos en 24 horas con una propuesta personalizada."
  },
];

const FAQSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Preguntas frecuentes
          </h2>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`glass-card overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 50 + 200}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-background/20 transition-colors"
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4 pt-0 text-muted-foreground whitespace-pre-line">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <a
            href={WHATSAPP_GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow-sm inline-flex items-center gap-2 text-primary-foreground"
          >
            <MessageCircle className="w-4 h-4" />
            <span>👉 Cuéntanos tu proyecto</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
