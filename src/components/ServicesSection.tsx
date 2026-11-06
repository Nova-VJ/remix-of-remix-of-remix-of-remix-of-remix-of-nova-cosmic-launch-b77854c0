import { lazy, Suspense, useState } from 'react';
import serviceWebIcon from '@/assets/service-web-icon.webp';
import serviceAppsIcon from '@/assets/service-apps-icon.webp';
import serviceBrandingIcon from '@/assets/service-branding-icon.webp';
import serviceSocialIcon from '@/assets/service-social-icon.webp';
import serviceContentIcon from '@/assets/service-content-icon.webp';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Check, Plus, TrendingUp, Search, Bot, BotMessageSquare, ChevronDown, FileEdit, ArrowRight, PencilRuler, Puzzle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SectionHeader from '@/components/SectionHeader';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n';

// Only downloaded when someone asks for a content proposal
const ContentFormModal = lazy(() => import('@/components/ContentFormModal'));

const ServicesSection = () => {
  const { t, isEn } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { addItem, items } = useCart();
  const [expandedAssistant, setExpandedAssistant] = useState<string | null>(null);
  const [showContentForm, setShowContentForm] = useState(false);
  const navigate = useNavigate();

  const services = [
    {
      id: 'web',
      image: serviceWebIcon,
      alt: t.services.web.title,
      title: t.services.web.title,
      description: t.services.web.description,
      includes: t.services.web.includes,
      price: 600,
      priceLabel: t.services.web.priceLabel,
      hasVirtualAssistant: true,
    },
    {
      id: 'apps',
      image: serviceAppsIcon,
      alt: t.services.apps.title,
      title: t.services.apps.title,
      description: t.services.apps.description,
      includes: t.services.apps.includes,
      price: 1700,
      priceLabel: t.services.apps.priceLabel,
      hasVirtualAssistant: true,
    },
    {
      id: 'social',
      image: serviceSocialIcon,
      alt: t.services.social.title,
      title: t.services.social.title,
      description: t.services.social.description,
      includes: t.services.social.includes,
      price: 500,
      priceLabel: t.services.social.priceLabel,
      isMonthly: true,
    },
    {
      id: 'branding',
      image: serviceBrandingIcon,
      alt: t.services.branding.title,
      title: t.services.branding.title,
      description: t.services.branding.description,
      includes: t.services.branding.includes,
      price: 200,
      priceLabel: t.services.branding.priceLabel,
    },
    {
      id: 'content',
      image: serviceContentIcon,
      alt: t.services.content.title,
      title: t.services.content.title,
      description: t.services.content.description,
      includes: t.services.content.includes,
      price: 0,
      priceLabel: t.services.content.priceLabel,
      hasContentForm: true,
      isFullWidth: true,
    }
  ];

  const virtualAssistants = [
    {
      id: 'assistant-pro',
      icon: Bot,
      title: t.services.assistantPro.title,
      subtitle: t.services.assistantPro.subtitle,
      features: t.services.assistantPro.features,
      useCase: t.services.assistantPro.useCase,
      price: 100,
      priceLabel: t.services.assistantPro.priceLabel,
    },
    {
      id: 'assistant-plus',
      icon: BotMessageSquare,
      title: t.services.assistantPlus.title,
      subtitle: t.services.assistantPlus.subtitle,
      features: t.services.assistantPlus.features,
      useCase: t.services.assistantPlus.useCase,
      price: 200,
      priceLabel: t.services.assistantPlus.priceLabel,
    }
  ];

  const additionalServices = [
    {
      id: 'marketing',
      icon: TrendingUp,
      title: t.services.marketing.title,
      subtitle: t.services.marketing.subtitle,
      description: t.services.marketing.description,
      price: 200,
      priceLabel: t.services.marketing.priceLabel,
      badge: t.services.marketing.badge,
    },
    {
      id: 'sem',
      icon: Search,
      title: t.services.sem.title,
      subtitle: t.services.sem.subtitle,
      description: t.services.sem.description,
      price: 150,
      priceLabel: t.services.sem.priceLabel,
      isMonthly: true,
      badge: t.services.sem.badge,
    }
  ];

  const handleAddToCart = (service: typeof services[0]) => {
    addItem({
      id: service.id,
      name: service.title,
      price: service.price,
      type: 'service' as const,
      isMonthly: service.isMonthly,
    });
    toast.success(isEn ? `${service.title} added to your quote` : `${service.title} añadido a tu presupuesto`);
  };

  const handleAddVirtualAssistant = (assistant: typeof virtualAssistants[0]) => {
    addItem({
      id: assistant.id,
      name: assistant.title,
      price: assistant.price,
      type: 'service' as const,
    });
    toast.success(isEn ? `${assistant.title} added to your quote` : `${assistant.title} añadido a tu presupuesto`);
  };

  const handleAddAdditionalService = (service: typeof additionalServices[0]) => {
    addItem({
      id: service.id,
      name: service.title,
      price: service.price,
      type: 'service' as const,
      isMonthly: service.isMonthly,
    });
    toast.success(isEn ? `${service.title} added to your quote` : `${service.title} añadido a tu presupuesto`);
  };

  const isInCart = (id: string) => items.some(item => item.id === id);

  const reveal = (delay = 0) => ({
    className: cn('transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'),
    style: { transitionDelay: `${delay}ms` },
  });

  const AddButton = ({ id, onAdd, label = isEn ? 'Add to quote' : 'Añadir al presupuesto', small = false }: { id: string; onAdd: () => void; label?: string; small?: boolean }) => (
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
          {small ? (isEn ? 'Added' : 'Añadido') : t.services.inYourQuote}
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
            eyebrow={t.services.eyebrow}
            title={t.services.title}
            subtitle={t.services.subtitle}
          />
        </div>

        {/* Main services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <article
              key={service.id}
              className={cn('group glass-card spotlight hover-lift p-6 flex flex-col hover:border-primary/30', reveal(index * 80 + 100).className)}
              style={reveal(index * 80 + 100).style}
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-background ring-1 ring-primary/10">
                <img
                  src={service.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`${service.id === 'content' ? 'h-[3.75rem] w-[3.75rem]' : 'h-12 w-12'} object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                />
              </div>
              <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{service.description}</p>

              {service.price > 0 ? (
                <p className="mt-4 text-xl font-bold text-foreground">{service.priceLabel}</p>
              ) : (
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {isEn ? "Custom quote after project audit" : "Precio a medida, tras analizar tu proyecto"}
                </p>
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
                {'hasContentForm' in service && Boolean(service.hasContentForm) && (
                  <Button onClick={() => setShowContentForm(true)} variant="ghost" className="w-full text-primary hover:text-primary">
                    <FileEdit className="w-4 h-4 mr-1.5" />
                    {t.services.content.cta}
                  </Button>
                )}
              </div>
            </article>
          ))}

          {/* Custom project card: fills the grid and leads to the briefing form */}
          <article
            className={cn('group flex flex-col justify-center rounded-2xl border border-dashed border-primary/40 bg-accent/50 p-6', reveal(services.length * 80 + 100).className)}
            style={reveal(services.length * 80 + 100).style}
          >
            {/* Layered "made to measure" emblem */}
            <span className="relative mb-6 mt-1 block h-16 w-16" aria-hidden="true">
              <span className="absolute inset-0 translate-x-2 translate-y-1 rotate-12 rounded-2xl bg-gradient-to-br from-fuchsia-300/70 to-sky-300/60 transition-transform duration-500 group-hover:rotate-[20deg]" />
              <span
                className="absolute inset-0 flex items-center justify-center rounded-2xl text-white shadow-[0_14px_28px_-10px_hsl(262_78%_45%/0.7),inset_0_1px_0_hsl(0_0%_100%/0.35)] transition-transform duration-500 group-hover:-translate-y-0.5"
                style={{ backgroundImage: 'var(--gradient-purple)' }}
              >
                <Puzzle className="h-8 w-8 drop-shadow-[0_2px_4px_hsl(262_80%_25%/0.5)]" />
              </span>
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-primary/15">
                <PencilRuler className="h-3.5 w-3.5 text-amber-500" />
              </span>
            </span>
            <h3 className="text-lg font-bold text-foreground">
              {isEn ? "Need a custom solution?" : "¿Necesitas algo a medida?"}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {isEn
                ? "E-commerce stores, custom booking engines, automations, API integrations... Tell us your vision and we'll architect the optimal roadmap."
                : "Tiendas online, reservas, automatizaciones, integraciones… Cuéntanos tu idea y te proponemos la mejor solución."}
            </p>
            <Button onClick={() => navigate('/?openBriefing=true')} className="mt-5 w-full">
              {t.nav.getQuote}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </article>
        </div>

        {/* Add-ons */}
        <div className={cn('mt-14 grid gap-5 lg:grid-cols-2', reveal(500).className)} style={reveal(500).style}>
          {/* AI assistant for the client's web or app */}
          <div className="glass-card p-6">
            <p className="eyebrow mb-2">{isEn ? "Add-On" : "Complemento"}</p>
            <h3 className="text-lg font-bold text-foreground">
              {isEn ? "AI Virtual Assistant for Your Website or App" : "Asistente virtual con IA para tu web o app"}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isEn ? "Serves your clients, answers questions, and schedules appointments automatically. One-time payment." : "Atiende a tus clientes, responde dudas y agenda citas por ti. Pago único."}
            </p>

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
                      <AddButton id={assistant.id} onAdd={() => handleAddVirtualAssistant(assistant)} label={isEn ? "Add" : "Añadir"} small />
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
            <p className="eyebrow mb-2">{isEn ? "Add-On" : "Complemento"}</p>
            <h3 className="text-lg font-bold text-foreground">
              {isEn ? "Growth Marketing & Advertising" : "Marketing y publicidad"}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isEn ? "Strategy and targeted campaigns to acquire paying customers from day one." : "Estrategia y campañas para atraer clientes desde el primer día."}
            </p>

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
                  <AddButton id={service.id} onAdd={() => handleAddAdditionalService(service)} label={isEn ? "Add" : "Añadir"} small />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Form Modal */}
      {showContentForm && (
        <Suspense fallback={null}>
          <ContentFormModal isOpen={showContentForm} onClose={() => setShowContentForm(false)} />
        </Suspense>
      )}
    </section>
  );
};

export default ServicesSection;
