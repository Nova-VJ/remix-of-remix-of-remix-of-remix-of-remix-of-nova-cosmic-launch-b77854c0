import { useState } from 'react';
import serviceWebIcon from '@/assets/service-web-icon.svg';
import serviceAppsIcon from '@/assets/service-apps-icon.svg';
import serviceBrandingIcon from '@/assets/service-branding-icon.svg';
import serviceSocialIcon from '@/assets/service-social-icon.svg';
import serviceContentIcon from '@/assets/service-content-icon.png';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Check, ShoppingCart, TrendingUp, Search, Bot, Sparkles, ChevronDown, ChevronUp, FileEdit } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentFormModal from '@/components/ContentFormModal';
const services = [
  {
    id: 'web',
    image: serviceWebIcon,
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
    image: serviceAppsIcon,
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
    image: serviceSocialIcon,
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
    image: serviceBrandingIcon,
    alt: "Branding profesional",
    title: "Branding profesional",
    description: "Creación de identidad visual premium y manual de marca",
    includes: ["Logotipo (variantes)", "Papelería corporativa", "Elementos gráficos"],
    price: 300,
    priceLabel: "desde 300€",
  },
  {
    id: 'content',
    image: serviceContentIcon,
    alt: "Creación de contenido",
    title: "Creación de contenido",
    description: "Contenido para Instagram, TikTok, YouTube, LinkedIn y tu web/app. Creatividad + estrategia orientada a resultados.",
    includes: ["Reels & Ads Creatives", "Guiones & Copywriting", "Calendario mensual"],
    price: 0,
    priceLabel: "Presupuesto enviado previo análisis",
    hasContentForm: true,
    isFullWidth: true,
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
  const [expandedAssistants, setExpandedAssistants] = useState<Record<string, boolean>>({});
  const [showContentForm, setShowContentForm] = useState(false);

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
    
    // Auto-expand virtual assistant options when adding web or apps to cart
    if (service.hasVirtualAssistant) {
      virtualAssistants.forEach(assistant => {
        const key = `${service.id}-${assistant.id}`;
        setExpandedAssistants(prev => ({ ...prev, [key]: true }));
      });
    }
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

  const toggleAssistantExpand = (serviceId: string, assistantId: string) => {
    const key = `${serviceId}-${assistantId}`;
    setExpandedAssistants(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isAssistantExpanded = (serviceId: string, assistantId: string) => {
    const key = `${serviceId}-${assistantId}`;
    return expandedAssistants[key] || false;
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
          {services.map((service, index) => (
            <div
              key={index}
              className={`glass-card p-6 flex flex-col transition-all duration-700 hover-lift ${(service as any).isFullWidth ? 'md:col-span-2 max-w-xl mx-auto w-full' : ''} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Service image */}
              <div className={`${(service as any).isFullWidth ? 'w-40 h-40' : 'w-20 h-20'} mx-auto mb-4 rounded-xl overflow-hidden`}>
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

              {/* Content Form button for content service */}
              {(service as any).hasContentForm && (
                <Button
                  onClick={() => setShowContentForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  <FileEdit className="w-4 h-4 mr-2" />
                  Rellenar formulario
                </Button>
              )}

              {/* Virtual Assistant sub-categories for web and apps */}
              {service.hasVirtualAssistant && (
                <div className="border-t border-border/50 pt-4 mt-auto space-y-3">
                  <p className="text-xs text-muted-foreground text-center font-medium uppercase tracking-wide">
                    Potencia tu {service.id === 'web' ? 'web' : 'app'} con IA
                  </p>
                  {virtualAssistants.map((assistant) => {
                    const isExpanded = isAssistantExpanded(service.id, assistant.id);
                    return (
                      <div
                        key={assistant.id}
                        className="bg-background/50 rounded-lg p-3 border border-border/30 transition-all duration-300"
                      >
                        <button
                          type="button"
                          onClick={() => toggleAssistantExpand(service.id, assistant.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <assistant.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-foreground">{assistant.title}</h4>
                              <p className="text-primary font-bold text-xs">{assistant.priceLabel}</p>
                            </div>
                            <div className="flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </button>
                        
                        <p className="text-xs text-muted-foreground mb-2">{assistant.subtitle}</p>
                        
                        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <ul className="space-y-1.5 mb-3">
                            {assistant.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                                <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-[11px] text-muted-foreground italic mb-3 bg-muted/30 p-2 rounded">
                            {assistant.useCase}
                          </p>
                        </div>
                        
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddVirtualAssistant(assistant);
                          }}
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
                    );
                  })}
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

      {/* Content Form Modal */}
      <ContentFormModal isOpen={showContentForm} onClose={() => setShowContentForm(false)} />
    </section>
  );
};

export default ServicesSection;
