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
    <section ref={ref} className={`py-16 bg-background transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* QR Poster */}
            <div className="flex justify-center">
              <img 
                src={posterQR} 
                alt="NOVA Marketing QR Poster" 
                className="rounded-2xl shadow-lg max-w-xs w-full"
              />
            </div>
            
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                ¿Tienes un código promocional?
              </h2>
              <p className="text-muted-foreground">
                Introduce tu código y obtén un descuento en tu próximo proyecto.
              </p>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Código promocional"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={handlePromoSubmit}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Aplicar
                </button>
              </div>
              
              {promoApplied && (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span>¡Código aplicado! 30% de descuento</span>
                </div>
              )}
              
              {promoError && (
                <p className="text-destructive text-sm">
                  Código no válido. Inténtalo de nuevo.
                </p>
              )}
              
              <a
                href={WHATSAPP_GENERAL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <MessageCircle className="w-5 h-5" />
                ¿Prefieres hablar por WhatsApp?
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TrustSection;