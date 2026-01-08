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
    if (promoCode.toUpperCase().trim() === 'NOVA30') {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  return (
    <section ref={ref} className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`glass-card p-8 md:p-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">¿Prefieres hablar por WhatsApp?</h2>
              <p className="text-muted-foreground">
                Escanea el QR y te atendemos en minutos. También puedes aplicar un código promocional si tienes uno.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Código promo (ej: NOVA30)"
                  className="flex-1 h-11 rounded-md bg-background/50 border border-border/30 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={handlePromoSubmit}
                  className="h-11 rounded-md bg-primary text-primary-foreground px-4 font-medium hover:bg-primary/90 transition-colors"
                >
                  Aplicar
                </button>
              </div>

              {promoApplied && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Código aplicado. ¡Descuento activado!
                </div>
              )}
              {promoError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <Tag className="w-4 h-4" />
                  Código no válido.
                </div>
              )}

              <a
                href={WHATSAPP_GENERAL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                Abrir WhatsApp
              </a>
            </div>

            <div className="flex justify-center md:justify-end">
              <img
                src={posterQR}
                alt="QR para contactar por WhatsApp"
                loading="lazy"
                className="w-full max-w-sm rounded-xl border border-border/30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TrustSection;