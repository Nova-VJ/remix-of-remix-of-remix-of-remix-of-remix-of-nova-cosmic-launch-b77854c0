import { useState } from 'react';
import posterQR from '@/assets/poster-qr.jpg';
import { MessageCircle, Tag, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const TrustSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const handlePromoSubmit = () => {
    if (promoCode.toUpperCase() === 'NOVA30') {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

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
            <p className="text-lg text-muted-foreground mb-6">
              Perfecto. Introduce tu código promocional y obtén un descuento exclusivo.
            </p>

            {/* Promo code input */}
            <div className="mb-6">
              <div className="flex gap-2 max-w-sm mx-auto md:mx-0">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError(false);
                    }}
                    placeholder="Código promocional"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    disabled={promoApplied}
                  />
                </div>
                <button
                  onClick={handlePromoSubmit}
                  disabled={promoApplied || !promoCode.trim()}
                  className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Aplicar
                </button>
              </div>
              
              {promoApplied && (
                <div className="flex items-center gap-2 mt-3 text-green-400 max-w-sm mx-auto md:mx-0">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">¡30% de descuento aplicado en tu primera compra!</span>
                </div>
              )}
              
              {promoError && (
                <p className="mt-3 text-destructive text-sm max-w-sm mx-auto md:mx-0">
                  Código no válido. Inténtalo de nuevo.
                </p>
              )}
            </div>

            <a
              href={promoApplied 
                ? "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20tengo%20el%20c%C3%B3digo%20NOVA30%20para%20un%2030%25%20de%20descuento.%20Mi%20proyecto%20es%3A%20_____"
                : WHATSAPP_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow-sm inline-flex items-center gap-2 text-primary-foreground"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{promoApplied ? 'Canjear descuento por WhatsApp' : 'Hablar por WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
