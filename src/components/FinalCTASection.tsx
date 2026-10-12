import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const FinalCTASection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const navigate = useNavigate();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="px-4 sm:px-6 py-16 md:py-20">
      <div
        className={`relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 md:py-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ backgroundImage: 'var(--gradient-cosmic)' }}
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-white md:text-5xl">¿Listo para empezar?</h2>
          <p className="mt-4 text-lg text-white/75 md:text-xl">
            Cuéntanos tu idea y te respondemos en 24 h con una propuesta a medida, sin compromiso.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/?openBriefing=true')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[hsl(var(--nova-ink))] shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Pide presupuesto
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href={WHATSAPP_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-5 w-5" />
              Chatea por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
