import serviceWeb from '@/assets/service-web.png';
import serviceApps from '@/assets/service-apps.png';
import serviceBranding from '@/assets/service-branding.png';
import serviceSocial from '@/assets/service-social.png';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Check, ShoppingCart, TrendingUp, Search, Bot, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const services = [
  {
    id: 'web',
    image: serviceWeb,
    alt: "Páginas web que convierten",
    title: "Páginas web que convierten",
    description: "Diseño + velocidad + SEO para vender más",
    includes: ["SEM base y estructura", "Embudos de venta", "Medición y optimización"],
    price: 1000,
    priceLabel: "desde 1.000€",
    hasVirtualAssistant: true,
  },
  {
    id: 'apps',
    image: serviceApps,
    alt: "Aplicaciones móviles",
    title: "Aplicaciones móviles",
    description: "Tu app a medida, lista para publicar.",
    includes: ["Guía en estructura, análisis y mejora", "App Store & Play Store", "Experiencia de usuario optimizada"],
    price: 1700,
    priceLabel: "desde 1.700€",
    hasVirtualAssistant: true,
  },
  {
    id: 'social',
    image: serviceSocial,
    alt: "Contenido para redes sociales",
    title: "Contenido para redes sociales",
    description: "Estrategia basada en algoritmo",
    includes: ["Crecimiento real y orgánico, copywriting", "Formato actual y adaptado al nicho"],
    price: 500,
    priceLabel: "500€/mes",
    isMonthly: true,
  },
  {
    id: 'branding',
    image: serviceBranding,
    alt: "Branding profesional",
    title: "Branding profesional",
    description: "Creación de identidad visual premium y manual de marca",
    includes: ["Logotipo (variantes)", "Papelería corporativa", "Elementos gráficos"],
    price: 300,
    priceLabel: "desde 300€",
  }
];

const virtualAssistants = [
  {
    id: 'assistant-pro',
    icon: Bot,
    title: "Asistente Virtual PRO",
    subtitle: "Ideal para negocios que quieren automatizar lo repetitivo.",
    features: [
      "Agenda citas automáticamente (Google Calendar / formularios / WhatsApp)",
      "Responde preguntas frecuentes predefinidas (horarios, precios base, servicios, ubicación, etc.)",
      "Captura datos del cliente (nombre, teléfono, necesidad)",
      "Deriva a humano cuando haga falta"
    ],
    useCase: "Uso típico: peluquerías, clínicas, restaurantes, servicios locales, academias.",
    price: 300,
    priceLabel: "300€",
  },
  {
    id: 'assistant-plus',
    icon: Sparkles,
    title: "Asistente Virtual PLUS",
    subtitle: "Para atención completa, 24/7, con IA avanzada.",
    features: [
      "Responde casi cualquier pregunta del cliente con contexto (servicios, procesos, dudas)",
      "Aprende de tu contenido: web / PDFs / catálogos / documentos",
      "Conversación más natural y personalizada",
      "Puede calificar leads y guiar a \"Solicitar presupuesto\" o \"Comprar\""
    ],
    useCase: "Uso típico: empresas con muchos servicios, ventas consultivas, soporte y captación constante.",
    price: 500,
    priceLabel: "500€",
  }
];

const additionalServices = [
  {
    id: 'marketing',
    icon: TrendingUp,
    title: "Marketing Digital",
    subtitle: "Desarrollo de Estrategia",
    description: "Planificación estratégica para maximizar tu presencia digital.",
    price: 200,
    priceLabel: "200€",
    badge: "Gratis con 2+ servicios",
  },
  {
    id: 'sem',
    icon: Search,
    title: "SEM",
    subtitle: "Posicionamiento en Google",
    description: "Crea campañas para el posicionamiento de tu página en Google.",
    price: 150,
    priceLabel: "150€/mes",
    isMonthly: true,
    badge: "Gratis con 4 servicios",
  }
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { addItem, items } = useCart();

  const handleAddToCart = (service: typeof services[0]) => {
    const cartItem = {
      id: service.id,
      name: service.title,
      price: service.price,
      type: 'service' as const,
      isMonthly: service.isMonthly,
    };
    addItem(cartItem);
    toast.success(`${service.title} añadido al carrito`);
  };

  const handleAddVirtualAssistant = (assistant: typeof virtualAssistants[0]) => {
    const cartItem = {
      id: assistant.id,
      name: assistant.title,
      price: assistant.price,
      type: 'service' as const,
    };
    addItem(cartItem);
    toast.success(`${assistant.title} añadido al carrito`);
  };

  const handleAddAdditionalService = (service: typeof additionalServices[0]) => {
    const cartItem = {
      id: service.id,
      name: service.title,
      price: service.price,
      type: 'service' as const,
      isMonthly: service.isMonthly,
    };
    addItem(cartItem);
    toast.success(`${service.title} añadido al carrito`);
  };

  const isInCart = (id: string) => items.some(item => item.id === id);

  return (
    <section id="servicios" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6 pt-24">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Nuestros servicios
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Soluciones digitales adaptadas a cada tipo de negocio.
          </p>
        </div>

        {/* Main services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`glass-card p-6 flex flex-col transition-all duration-700 hover-lift ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Service image */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title and description */}
              <h3 className="text-xl font-bold text-foreground text-center mb-1">{service.title}</h3>
              <p className="text-primary font-bold text-center mb-2">{service.priceLabel}</p>
              <p className="text-muted-foreground text-center mb-4">{service.description}</p>

              {/* Includes list */}
              <ul className="space-y-2 mb-6 flex-1">
                {service.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Add to cart button */}
              <Button
                onClick={() => handleAddToCart(service)}
                disabled={isInCart(service.id)}
                variant={isInCart(service.id) ? "secondary" : "default"}
                className="w-full mb-4"
              >
                {isInCart(service.id) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    En tu carrito
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Añadir al carrito
                  </>
                )}
              </Button>

              {/* Virtual Assistant sub-categories for web and apps */}
              {service.hasVirtualAssistant && (
                <div className="border-t border-border/50 pt-4 mt-auto space-y-3">
                  <p className="text-xs text-muted-foreground text-center font-medium uppercase tracking-wide">
                    Potencia tu {service.id === 'web' ? 'web' : 'app'} con IA
                  </p>
                  {virtualAssistants.map((assistant) => (
                    <div
                      key={assistant.id}
                      className="bg-background/50 rounded-lg p-3 border border-border/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <assistant.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-foreground">{assistant.title}</h4>
                          <p className="text-primary font-bold text-xs">{assistant.priceLabel}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{assistant.subtitle}</p>
                      <ul className="space-y-1 mb-2">
                        {assistant.features.slice(0, 2).map((feature, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/70">
                            <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-muted-foreground italic mb-2">{assistant.useCase}</p>
                      <Button
                        onClick={() => handleAddVirtualAssistant(assistant)}
                        disabled={isInCart(assistant.id)}
                        variant="outline"
                        size="sm"
                        className="w-full h-7 text-xs"
                      >
                        {isInCart(assistant.id) ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Añadido
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Añadir
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional services */}
        <div className={`mt-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <h3 className="text-xl font-bold text-foreground text-center mb-6">Servicios adicionales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map((service, index) => (
              <div
                key={service.id}
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-foreground text-sm">{service.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium whitespace-nowrap">
                      {service.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{service.subtitle}</p>
                  <p className="text-primary font-bold text-sm">{service.priceLabel}</p>
                </div>
                <Button
                  onClick={() => handleAddAdditionalService(service)}
                  disabled={isInCart(service.id)}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  {isInCart(service.id) ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
