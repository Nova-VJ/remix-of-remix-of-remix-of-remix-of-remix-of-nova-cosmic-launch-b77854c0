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
    title: "Desarrollo web que convierte",
    description: "Diseño + velocidad + SEO para vender más.",
    includes: [
      "Base y estructura SEO",
      "Embudos de venta",
      "Medición y optimización"
    ],
    cta: "Quiero mi web",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20un%20presupuesto%20para%20una%20p%C3%A1gina%20web.%20Busco%20SEO%2C%20embudos%20de%20venta%20y%20posicionamiento%20en%20Google.%20Mi%20negocio%20es%3A%20_____.",
  },
  {
    image: serviceApps,
    alt: "Apps móviles (Android / iOS)",
    title: "Aplicaciones móviles",
    description: "Tu app a medida, lista para publicar.",
    includes: [
      "Definición de funcionalidades y estructura",
      "UX limpio y rápido",
      "Preparación para App Store y Google Play"
    ],
    cta: "Quiero mi app",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20desarrollar%20una%20aplicaci%C3%B3n%20m%C3%B3vil%20(Android%20/%20iOS).%20La%20idea%20general%20de%20la%20app%20es%3A%20_____%20y%20mi%20objetivo%20es%3A%20_____.",
  },
  {
    image: serviceSocial,
    alt: "Contenido para redes sociales",
    title: "Contenido para redes sociales",
    description: "Estrategia + contenido para crecer de forma consistente.",
    includes: [
      "Planificación y calendario de contenido",
      "Copywriting orientado a conversión",
      "Optimización basada en métricas"
    ],
    cta: "Quiero crecer en redes",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20contenido%20y%20estrategia%20para%20redes%20sociales.%20Mi%20sector%20es%3A%20_____%20y%20mi%20objetivo%20principal%20es%3A%20crecimiento%20/%20ventas.",
  },
  {
    image: serviceBranding,
    alt: "Branding profesional completo",
    title: "Branding profesional",
    description: "Una identidad visual premium para tu marca.",
    includes: [
      "Identidad visual + guía de marca",
      "Logo (variantes)",
      "Plantillas y activos digitales"
    ],
    cta: "Quiero mi branding",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20un%20branding%20profesional%20completo.%20Necesito%20identidad%20de%20marca%2C%20logo%2C%20manual%20y%20material%20corporativo.%20Mi%20marca%20se%20llama%3A%20_____.",
  },
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="services" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Nuestros servicios
          </h2>
          <p className="text-muted-foreground text-lg">
            Soluciones digitales adaptadas a cada tipo de negocio.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`glass-card p-6 transition-all duration-700 hover-lift ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <a
                  href={service.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group flex-shrink-0"
                >
                  <img 
                    src={service.image} 
                    alt={service.alt}
                    className="w-full md:w-40 h-auto rounded-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_rgba(167,139,250,0.3)] group-hover:brightness-110"
                  />
                </a>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  {/* Includes list */}
                  <ul className="space-y-2 mb-4">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={service.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>👉 {service.cta}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
