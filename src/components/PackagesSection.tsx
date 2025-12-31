import { Check, MessageCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import pkgWeb from '@/assets/pkg-web.png';
import pkgApps from '@/assets/pkg-apps.png';
import pkgSocial from '@/assets/pkg-social.png';
import pkgBranding from '@/assets/pkg-branding.png';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const packages = [
  {
    name: "Contenido para redes sociales",
    price: "500€ / mes",
    image: pkgSocial,
    description: "Para marcas que quieren crecer de forma constante en redes sociales.",
    includes: [
      "Estrategia basada en algoritmo",
      "Crecimiento real y orgánico, copywriting",
      "Formato actual y adaptado al nicho"
    ],
    cta: "Quiero crecer en redes",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20me%20interesa%20el%20paquete%20de%20Contenido%20mensual%20(500%E2%82%AC/mes).%20Mi%20sector%20es%3A%20_____"
  },
  {
    name: "Branding profesional",
    price: "desde 300€",
    image: pkgBranding,
    description: "Construye una marca sólida, consistente y premium.",
    includes: [
      "Creación de identidad visual premium y manual de marca",
      "Logotipo (variantes)",
      "Papelería corporativa",
      "Elementos gráficos"
    ],
    cta: "Quiero mi branding",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20me%20interesa%20el%20paquete%20Branding%20Pro%20desde%20300%E2%82%AC.%20Mi%20marca%20se%20llama%3A%20_____"
  },
  {
    name: "Aplicaciones móviles",
    price: "desde 1.700€",
    image: pkgApps,
    description: "Convierte tu idea en una app funcional y escalable.",
    includes: [
      "Tu app a medida, lista para publicar",
      "Guía en estructura, análisis y mejora",
      "App Store & Play Store",
      "Experiencia de usuario optimizada"
    ],
    cta: "Quiero mi app",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20me%20interesa%20el%20paquete%20App%20MVP%20desde%201.700%E2%82%AC.%20La%20idea%20de%20mi%20app%20es%3A%20_____"
  },
  {
    name: "Páginas web que convierten",
    price: "desde 1.000€",
    image: pkgWeb,
    description: "Diseño + velocidad + SEO para vender más.",
    includes: [
      "SEO base y estructura",
      "Embudos y landing pages",
      "Medición y optimización"
    ],
    cta: "Quiero mi web",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20me%20interesa%20el%20paquete%20Web%20Pro%20desde%201.000%E2%82%AC.%20Mi%20negocio%20es%3A%20_____"
  }
];

const PackagesSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Paquetes de desarrollo
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Soluciones claras, escalables y orientadas a resultados. Elige el punto de partida que mejor se adapte a tu negocio.
          </p>
        </div>

        {/* Packages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`glass-card p-6 flex flex-col transition-all duration-700 hover-lift ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Icon and header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
                  <span className="text-primary font-bold">{pkg.price}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 text-sm">{pkg.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={pkg.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                <span>👉 {pkg.cta}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Not sure CTA */}
        <div
          className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-muted-foreground mb-4">¿No sabes qué paquete elegir?</p>
          <a
            href={WHATSAPP_GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow-sm inline-flex items-center gap-2 text-primary-foreground"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Solicita tu propuesta gratuita</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
