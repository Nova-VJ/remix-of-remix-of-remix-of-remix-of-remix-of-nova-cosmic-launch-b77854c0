import { Globe, Smartphone, Palette, Megaphone } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: "Páginas web que convierten",
    hook: "SEO + embudos para captar clientes.",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20un%20presupuesto%20para%20una%20p%C3%A1gina%20web.%20Busco%20SEO%2C%20embudos%20de%20venta%20y%20posicionamiento%20en%20Google.%20Mi%20negocio%20es%3A%20_____.",
  },
  {
    icon: Smartphone,
    title: "Apps móviles (Android / iOS)",
    hook: "Tu idea en la App Store y Google Play.",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20desarrollar%20una%20aplicaci%C3%B3n%20m%C3%B3vil%20(Android%20/%20iOS).%20La%20idea%20general%20de%20la%20app%20es%3A%20_____%20y%20mi%20objetivo%20es%3A%20_____.",
  },
  {
    icon: Palette,
    title: "Branding profesional completo",
    hook: "Identidad sólida para destacar y vender.",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20un%20branding%20profesional%20completo.%20Necesito%20identidad%20de%20marca%2C%20logo%2C%20manual%20y%20material%20corporativo.%20Mi%20marca%20se%20llama%3A%20_____.",
  },
  {
    icon: Megaphone,
    title: "Contenido para redes sociales",
    hook: "Estrategia + formato actual para crecer.",
    whatsapp: "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20contenido%20y%20estrategia%20para%20redes%20sociales.%20Mi%20sector%20es%3A%20_____%20y%20mi%20objetivo%20principal%20es%3A%20crecimiento%20/%20ventas.",
  },
];

const ServicesSection = () => {
  return (
    <section className="relative py-20 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
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
              className="glass-card p-6 hover-lift cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className="service-icon flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {service.hook}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
