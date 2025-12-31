import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "María García",
    business: "Clínica Dental Sonrisa",
    location: "Valladolid",
    text: "Desde que NOVA rediseñó nuestra web y gestiona nuestras redes, las citas han aumentado un 40%. El equipo es muy profesional y siempre disponible.",
    rating: 5
  },
  {
    name: "Carlos Rodríguez",
    business: "Restaurante El Fogón",
    location: "Valladolid",
    text: "Nos hicieron el branding completo y la carta digital. El resultado superó nuestras expectativas. Ahora nuestros clientes nos reconocen al instante.",
    rating: 5
  },
  {
    name: "Laura Martínez",
    business: "FitZone Gym",
    location: "Palencia",
    text: "La app que desarrollaron para reservas de clases ha sido un éxito total. Nuestros socios la usan a diario y las reseñas son excelentes.",
    rating: 5
  }
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Historias reales de negocios que han crecido con nosotros.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass-card p-6 flex flex-col transition-all duration-700 hover-lift ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 text-sm mb-6 flex-1 italic">
                "{testimonial.text}"
              </p>

              {/* Author info */}
              <div>
                <p className="text-foreground font-semibold">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.business}</p>
                <p className="text-muted-foreground text-xs">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
