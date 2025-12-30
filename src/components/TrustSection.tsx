import posterQR from '@/assets/poster-qr.jpg';
import { MessageCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const TrustSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6 overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Poster image */}
          <div className={`order-2 md:order-1 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="glass-card p-4 max-w-sm mx-auto md:mx-0 hover-lift">
              <img 
                src={posterQR} 
                alt="Cartel NOVA Marketing Solutions" 
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>

          {/* Text content */}
          <div className={`order-1 md:order-2 text-center md:text-left transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 text-glow">
              ¿Llegaste por el QR del cartel?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Perfecto. Cuéntanos tu idea y te respondemos por WhatsApp.
            </p>

            <a
              href={WHATSAPP_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow-sm inline-flex items-center gap-2 text-primary-foreground"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hablar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
