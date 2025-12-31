import serviceWeb from '@/assets/service-web.png';
import serviceApps from '@/assets/service-apps.png';
import serviceBranding from '@/assets/service-branding.png';
import serviceSocial from '@/assets/service-social.png';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Check, MessageCircle } from 'lucide-react';

const services = [
  {
    image: serviceWeb,
    alt: "Páginas web que convierten",
    title: "Páginas web que convierten",
    description: "Diseño + velocidad + SEO para vender más.",
    includes: ["SEO base y estructura", "Embudos y landing pages", "Medición y optimización"],
    cta: "Quiero mi web",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20un%20presupuesto%20para%20una%20p%C3%A1gina%20web.%20Busco%20SEO%2C%20embudos%20de%20venta%20y%20posicionamiento%20en%20Google.%20Mi%20negocio%20es%3A%20_____."
  },
  {
    image: serviceApps,
    alt: "Aplicaciones móviles",
    title: "Aplicaciones móviles",
    description: "Tu app a medida, lista para publicar.",
    includes: ["Guía en estructura, análisis y mejora", "App Store & Play Store", "Experiencia de usuario optimizada"],
    cta: "Quiero mi app",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20desarrollar%20una%20aplicaci%C3%B3n%20m%C3%B3vil%20(Android%20/%20iOS).%20La%20idea%20general%20de%20la%20app%20es%3A%20_____%20y%20mi%20objetivo%20es%3A%20_____."
  },
  {
    image: serviceSocial,
    alt: "Contenido para redes sociales",
    title: "Contenido para redes sociales",
    description: "Estrategia basada en algoritmo",
    includes: ["Crecimiento real y orgánico, copywriting", "Formato actual y adaptado al nicho"],
    cta: "Quiero crecer en redes",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20contenido%20y%20estrategia%20para%20redes%20sociales.%20Mi%20sector%20es%3A%20_____%20y%20mi%20objetivo%20principal%20es%3A%20crecimiento%20/%20ventas."
  },
  {
    image: serviceBranding,
    alt: "Branding profesional",
    title: "Branding profesional",
    description: "Creación de identidad visual premium y manual de marca",
    includes: ["Logotipo (variantes)", "Papelería corporativa", "Elementos gráficos"],
    cta: "Quiero mi branding",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20un%20branding%20profesional%20completo.%20Necesito%20identidad%20de%20marca%2C%20logo%2C%20manual%20y%20material%20corporativo.%20Mi%20marca%20se%20llama%3A%20_____."
  }
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="servicios" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
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

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <h3 className="text-xl font-bold text-foreground text-center mb-2">{service.title}</h3>
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

              {/* CTA Button */}
              <a
                href={service.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                <span>👉 {service.cta}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
