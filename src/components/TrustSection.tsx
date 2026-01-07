import { useState } from 'react';
import posterQR from '@/assets/poster-qr.jpg';
import { MessageCircle, Tag, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";
const TrustSection = () => {
  const {
    ref,
    isVisible
  } = useScrollReveal({
    threshold: 0.1
  });
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
    <section ref={ref} className={`py-20 bg-gradient-to-b from-background to-muted/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Tienes un código promocional?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aplica tu código y obtén un descuento especial en tu próximo proyecto
          </p>
        </div>

        <div className="max-w-md mx-auto glass-card p-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Introduce tu código"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            
            <button
              onClick={handlePromoSubmit}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Aplicar código
            </button>

            {promoApplied && (
              <div className="flex items-center gap-2 text-green-500 justify-center">
                <CheckCircle className="w-5 h-5" />
                <span>¡Código NOVA30 aplicado! 30% de descuento</span>
              </div>
            )}

            {promoError && (
              <p className="text-destructive text-center text-sm">
                Código no válido. Intenta de nuevo.
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            ¿Prefieres hablar directamente con nosotros?
          </p>
          <a
            href={WHATSAPP_GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Pedir presupuesto por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
export default TrustSection;