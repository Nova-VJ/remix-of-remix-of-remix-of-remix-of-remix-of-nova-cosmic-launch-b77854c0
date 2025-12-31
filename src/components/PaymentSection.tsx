import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { CreditCard, Shield, CheckCircle, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logoStripe from '@/assets/logo-stripe.webp';
import logoPaypal from '@/assets/logo-paypal.png';
import logoCards from '@/assets/logo-cards.png';

const WHATSAPP_PROPOSAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20una%20propuesta%20personalizada.%20Mi%20proyecto%20es%3A%20_____";

const services = [
  { name: "Desarrollo web", basePrice: 1000 },
  { name: "Aplicación móvil", basePrice: 1700 },
  { name: "Contenido redes sociales", basePrice: 600 },
  { name: "Branding", basePrice: 300 }
];

const PaymentSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [selectedService, setSelectedService] = useState(0);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'NOVA30') {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  const basePrice = services[selectedService].basePrice;
  const discountedPrice = promoApplied ? Math.round(basePrice * 0.7) : basePrice;

  // Placeholder URLs - will be replaced with real Stripe/PayPal checkout links
  const stripeCheckoutUrl = "#stripe-checkout";
  const paypalCheckoutUrl = "#paypal-checkout";

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Pagos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Inicia tu proyecto de forma segura con tarjeta, Stripe o PayPal.
          </p>
        </div>

        {/* User account card */}
        <div className={`glass-card p-6 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '150ms' }}>
          {user ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Sesión iniciada</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-medium text-sm"
              >
                Ver mis proyectos
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background/50 border border-border/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-foreground font-medium">¿Tienes cuenta?</p>
                  <p className="text-muted-foreground text-sm">Accede para ver tus proyectos y pagos</p>
                </div>
              </div>
              <Link
                to="/auth"
                className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-medium text-sm"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>

        {/* Main payment card */}
        <div className={`glass-card p-8 mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '200ms' }}>
          
          {/* Info text */}
          <div className="mb-8 space-y-2 text-foreground/80 text-sm">
            <p>Puedes reservar tu proyecto con un depósito para asegurar tu plaza.</p>
            <p>Los pagos se procesan a través de un checkout profesional y seguro.</p>
            <p className="text-muted-foreground text-xs">
              Los precios mostrados son precios base de desarrollo. El alcance y coste final pueden variar según la complejidad del proyecto. Cualquier cantidad pagada se descontará del presupuesto final.
            </p>
          </div>

          {/* Service selector */}
          <div className="mb-6">
            <label className="block text-foreground text-sm font-medium mb-2">Selecciona el servicio:</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-background/50 border border-border/30 text-foreground focus:outline-none focus:border-primary/50"
            >
              {services.map((service, index) => (
                <option key={index} value={index}>
                  {service.name} — desde {service.basePrice}€
                </option>
              ))}
            </select>
          </div>

          {/* Price display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              {promoApplied && (
                <span className="text-muted-foreground line-through text-xl">{basePrice}€</span>
              )}
              <span className="text-3xl font-bold text-primary">{discountedPrice}€</span>
            </div>
            {promoApplied && (
              <p className="text-sm text-primary mt-1">¡30% de descuento aplicado!</p>
            )}
          </div>

          {/* Promo code */}
          <div className="mb-8">
            <label className="block text-foreground text-sm font-medium mb-2">
              Código promocional (opcional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Introduce tu código"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoError(false);
                }}
                className="flex-1 p-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={handleApplyPromo}
                className="px-6 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-medium"
              >
                Aplicar
              </button>
            </div>
            {promoApplied && (
              <p className="text-sm text-primary mt-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Código NOVA30 aplicado correctamente
              </p>
            )}
            {promoError && (
              <p className="text-sm text-destructive mt-2">Código no válido</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Usa el código <span className="text-primary font-medium">NOVA30</span> y obtén un 30% de descuento en tu primer proyecto.
            </p>
          </div>

          {/* Payment buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <a
              href={stripeCheckoutUrl}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-background/80 border border-border/40 text-foreground hover:bg-background/60 hover:border-primary/30 transition-all font-medium"
            >
              <CreditCard className="w-5 h-5" />
              <span>Pagar con tarjeta (Stripe)</span>
            </a>
            <a
              href={paypalCheckoutUrl}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-background/80 border border-border/40 text-foreground hover:bg-background/60 hover:border-primary/30 transition-all font-medium"
            >
              <img src={logoPaypal} alt="PayPal" className="h-5 w-auto opacity-80" />
              <span>Pagar con PayPal</span>
            </a>
          </div>

          {/* Trust logos */}
          <div className="flex items-center justify-center gap-6 mb-6 opacity-60">
            <img src={logoStripe} alt="Stripe" className="h-6 w-auto grayscale brightness-200" />
            <img src={logoPaypal} alt="PayPal" className="h-6 w-auto grayscale brightness-200" />
            <img src={logoCards} alt="Visa Mastercard Amex" className="h-6 w-auto grayscale brightness-200" />
          </div>

          {/* Security note */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Lock className="w-3 h-3" />
              Checkout seguro a través de Stripe y PayPal.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Recibirás una confirmación por email y los siguientes pasos tras el pago.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className={`glass-card p-6 mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '400ms' }}>
          <h3 className="text-lg font-bold text-foreground mb-4 text-center">Cómo funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">Elige tu método de pago</p>
                <p className="text-muted-foreground text-xs">Tarjeta, Stripe o PayPal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">Completa el checkout seguro</p>
                <p className="text-muted-foreground text-xs">Proceso 100% protegido</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">Recibe confirmación</p>
                <p className="text-muted-foreground text-xs">Por email, con los siguientes pasos</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            No almacenamos datos de pago sensibles en nuestro sitio web.
          </p>
        </div>

        {/* Prefer to talk first */}
        <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <p className="text-muted-foreground mb-4">¿Prefieres hablar primero?</p>
          <a
            href={WHATSAPP_PROPOSAL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow-sm inline-flex items-center gap-2 text-primary-foreground"
          >
            Solicita una propuesta y te enviamos un enlace de pago seguro
          </a>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
