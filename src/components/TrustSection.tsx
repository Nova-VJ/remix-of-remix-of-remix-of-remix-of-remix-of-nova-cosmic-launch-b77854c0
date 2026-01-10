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
    if (promoCode.toUpperCase().trim() === 'NOVA30') {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-16 px-6">
      <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3">
              <img 
                src={posterQR} 
                alt="QR Code Nova" 
                className="w-full max-w-[200px] mx-auto rounded-xl shadow-lg"
              />
            </div>
            <div className="w-full md:w-2/3 text-left">
              <h3 className="text-xl font-bold text-foreground mb-4">
                ¿Tienes un código promocional?
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Introduce tu código"
                  className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handlePromoSubmit}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              {promoApplied && (
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  ¡Código NOVA30 aplicado! -30% en tu primer servicio
                </div>
              )}
              {promoError && (
                <p className="text-destructive text-sm">Código no válido</p>
              )}
              <a
                href={WHATSAPP_GENERAL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TrustSection;