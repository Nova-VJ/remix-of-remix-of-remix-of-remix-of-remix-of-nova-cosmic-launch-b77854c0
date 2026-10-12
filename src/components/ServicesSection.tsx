import { useState } from 'react';
import serviceWebIcon from '@/assets/service-web-icon.webp';
import serviceAppsIcon from '@/assets/service-apps-icon.webp';
import serviceBrandingIcon from '@/assets/service-branding-icon.webp';
import serviceSocialIcon from '@/assets/service-social-icon.webp';
import serviceContentIcon from '@/assets/service-content-icon.webp';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Check, Plus, TrendingUp, Search, Bot, BotMessageSquare, ChevronDown, FileEdit, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentFormModal from '@/components/ContentFormModal';
import SectionHeader from '@/components/SectionHeader';
import { cn } from '@/lib/utils';
const services = [
  {
    id: 'web',
    image: serviceWebIcon,
    alt: "Páginas web que convierten",
    title: "Páginas web que convierten",
    description: "Diseño + velocidad + Posicionamiento en Google",
    includes: ["SEO (Visitas)", "Embudos de venta", "Medición y optimización"],
    price: 600,
    priceLabel: "desde 600€",
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
    price: 200,
    priceLabel: "desde 200€",
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
    price: 100,
    priceLabel: "100€ · pago único",
  },
  {
    id: 'assistant-plus',
    icon: BotMessageSquare,
    title: "Asistente Virtual PLUS",
    subtitle: "Para atención completa, 24/7, con IA avanzada.",
    features: [
      "Responde casi cualquier pregunta del cliente con contexto (servicios, procesos, dudas)",
      "Aprende de tu contenido: web / PDFs / catálogos / documentos",
      "Conversación más natural y personalizada",
      "Puede calificar leads y guiar a \"Solicitar presupuesto\" o \"Comprar\""
    ],
    useCase: "Uso típico: empresas con muchos servicios, ventas consultivas, soporte y captación constante.",
    price: 200,
    priceLabel: "200€ · pago único",
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
    subtitle: "Creación y seguimiento de campañas en Google/Social Ads",
    description: "Creación y seguimiento de campañas en Google/Social Ads",
    price: 150,
    priceLabel: "150€/mes",
    isMonthly: true,
    badge: "Primer mes gratis con 4 servicios",
  }
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { addItem, items } = useCart();
  const [expandedAssistant, setExpandedAssistant] = useState<string | null>(null);
  const [showContentForm, setShowContentForm] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (service: typeof services[0]) => {
    addItem({
      id: service.id,
      name: service.title,
      price: service.price,
      type: 'service' as const,
      isMonthly: service.isMonthly,
    });
    toast.success(`${service.title} añadido a tu presupuesto`);
  };

  const handleAddVirtualAssistant = (assistant: typeof virtualAssistants[0]) => {
    addItem({
      id: assistant.id,
      name: assistant.title,
      price: assistant.price,
      type: 'service' as const,
    });
    toast.success(`${assistant.title} añadido a tu presupuesto`);
  };

  const handleAddAdditionalService = (service: typeof additionalServices[0]) => {
    addItem({
      id: service.id,
      name: service.title,
      price: service.price,
      type: 'service' as const,
      isMonthly: service.isMonthly,
    });
    toast.success(`${service.title} añadido a tu presupuesto`);
  };

  const isInCart = (id: string) => items.some(item => item.id === id);

  const reveal = (delay = 0) => ({
    className: cn('transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'),
    style: { transitionDelay: `${delay}ms` },
  });

  const AddButton = ({ id, onAdd, label = 'Añadir al presupuesto', small = false }: { id: string; onAdd: () => void; label?: string; small?: boolean }) => (
    <Button
      onClick={onAdd}
      disabled={isInCart(id)}
      variant={isInCart(id) ? 'secondary' : 'outline'}
      size={small ? 'sm' : 'default'}
      className={cn(!small && 'w-full')}
    >
      {isInCart(id) ? (
        <>
          <Check className="w-4 h-4 mr-1.5" />
          {small ? 'Añadido' : 'En tu presupuesto'}
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-1.5" />
          {label}
        </>
      )}
    </Button>
  );

  return (
    <section id="servicios" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 md:py-28 px-4 sm:px-6 bg-muted/40 border-y border-border">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div {...reveal()}>
          <SectionHeader
            eyebrow="Servicios"
            title="Todo lo que tu negocio necesita para crecer online"
            subtitle="Elige un servicio o combínalos. Los precios son orientativos: analizamos tu proyecto y te enviamos el presupuesto final sin compromiso."
          />
        </div>

        {/* Main services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <article
              key={service.id}
              className={cn('glass-card hover-lift p-6 flex flex-col', reveal(index * 80 + 100).className)}
              style={reveal(index * 80 + 100).style}
            >
              <img
                src={service.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-14 h-14 object-contain mb-5"
              />
              <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{service.description}</p>

              {service.price > 0 ? (
                <p className="mt-4 text-xl font-bold text-foreground">{service.priceLabel}</p>
              ) : (
                <p className="mt-4 text-sm font-semibold text-foreground">Precio a medida, tras analizar tu proyecto</p>
              )}

              <ul className="mt-4 mb-6 space-y-2 flex-1">
                {service.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <AddButton id={service.id} onAdd={() => handleAddToCart(service)} />
                {(service as any).hasContentForm && (
                  <Button onClick={() => setShowContentForm(true)} variant="ghost" className="w-full text-primary hover:text-primary">
                    <FileEdit className="w-4 h-4 mr-1.5" />
                    Pedir propuesta de contenido
                  </Button>
                )}
              </div>
            </article>
          ))}

          {/* Custom project card: fills the grid and leads to the briefing form */}
          <article
            className={cn('flex flex-col justify-center rounded-2xl border border-dashed border-primary/40 bg-accent/50 p-6', reveal(services.length * 80 + 100).className)}
            style={reveal(services.length * 80 + 100).style}
          >
            <h3 className="text-lg font-bold text-foreground">¿Necesitas algo a medida?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Tiendas online, reservas, automatizaciones, integraciones… Cuéntanos tu idea y te proponemos la mejor solución.
            </p>
            <Button onClick={() => navigate('/?openBriefing=true')} className="mt-5 w-full">
              Pide presupuesto
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </article>
        </div>

        {/* Add-ons */}
        <div className={cn('mt-14 grid gap-5 lg:grid-cols-2', reveal(500).className)} style={reveal(500).style}>
          {/* AI assistant for the client's web or app */}
          <div className="glass-card p-6">
            <p className="eyebrow mb-2">Complemento</p>
            <h3 className="text-lg font-bold text-foreground">Asistente virtual con IA para tu web o app</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">Atiende a tus clientes, responde dudas y agenda citas por ti. Pago único.</p>

            <div className="mt-5 divide-y divide-border rounded-xl border border-border">
              {virtualAssistants.map((assistant) => {
                const isExpanded = expandedAssistant === assistant.id;
                return (
                  <div key={assistant.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <assistant.icon className="h-5 w-5" />
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedAssistant(isExpanded ? null : assistant.id)}
                        className="min-w-0 flex-1 text-left"
                        aria-expanded={isExpanded}
                      >
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          {assistant.title}
                          <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
                        </span>
                        <span className="block text-xs text-muted-foreground">{assistant.priceLabel}</span>
                      </button>
                      <AddButton id={assistant.id} onAdd={() => handleAddVirtualAssistant(assistant)} label="Añadir" small />
                    </div>
                    <div className={cn('grid transition-all duration-300', isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0')}>
                      <div className="overflow-hidden">
                        <p className="text-sm text-muted-foreground">{assistant.subtitle}</p>
                        <ul className="mt-2 space-y-1.5">
                          {assistant.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-sm text-foreground/80">
                              <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2 text-xs text-muted-foreground">{assistant.useCase}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marketing add-ons */}
          <div className="glass-card p-6">
            <p className="eyebrow mb-2">Complemento</p>
            <h3 className="text-lg font-bold text-foreground">Marketing y publicidad</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">Estrategia y campañas para atraer clientes desde el primer día.</p>

            <div className="mt-5 divide-y divide-border rounded-xl border border-border">
              {additionalServices.map((service) => (
                <div key={service.id} className="flex items-center gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <service.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{service.title} · <span className="font-normal text-muted-foreground">{service.priceLabel}</span></p>
                    <p className="text-xs text-muted-foreground">{service.subtitle}</p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      {service.badge}
                    </span>
                  </div>
                  <AddButton id={service.id} onAdd={() => handleAddAdditionalService(service)} label="Añadir" small />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Form Modal */}
      <ContentFormModal isOpen={showContentForm} onClose={() => setShowContentForm(false)} />
    </section>
  );
};

export default ServicesSection;
