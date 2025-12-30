import serviceWeb from '@/assets/service-web.png';
import serviceApps from '@/assets/service-apps.png';
import serviceBranding from '@/assets/service-branding.png';
import serviceSocial from '@/assets/service-social.png';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const services = [
  {
    image: serviceWeb,
    alt: "Páginas web que convierten",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20un%20presupuesto%20para%20una%20p%C3%A1gina%20web.%20Busco%20SEO%2C%20embudos%20de%20venta%20y%20posicionamiento%20en%20Google.%20Mi%20negocio%20es%3A%20_____.",
  },
  {
    image: serviceApps,
    alt: "Apps móviles (Android / iOS)",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20desarrollar%20una%20aplicaci%C3%B3n%20m%C3%B3vil%20(Android%20/%20iOS).%20La%20idea%20general%20de%20la%20app%20es%3A%20_____%20y%20mi%20objetivo%20es%3A%20_____.",
  },
  {
    image: serviceBranding,
    alt: "Branding profesional completo",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20un%20branding%20profesional%20completo.%20Necesito%20identidad%20de%20marca%2C%20logo%2C%20manual%20y%20material%20corporativo.%20Mi%20marca%20se%20llama%3A%20_____.",
  },
  {
    image: serviceSocial,
    alt: "Contenido para redes sociales",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20contenido%20y%20estrategia%20para%20redes%20sociales.%20Mi%20sector%20es%3A%20_____%20y%20mi%20objetivo%20principal%20es%3A%20crecimiento%20/%20ventas.",
  },
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Servicios
          </h2>
          <p className="text-muted-foreground text-lg">
            ¿Qué necesitas para tu negocio?
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <a
              key={index}
              href={service.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={`block group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <img 
                src={service.image} 
                alt={service.alt}
                className="w-full h-auto rounded-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_rgba(167,139,250,0.3)] group-hover:brightness-110"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
