import { useScrollReveal } from '@/hooks/use-scroll-reveal';
const testimonials = [{
  name: "María García",
  business: "Clínica Dental Sonrisa",
  location: "Valladolid",
  text: "Desde que NOVA rediseñó nuestra web y gestiona nuestras redes, las citas han aumentado un 40%. El equipo es muy profesional y siempre disponible.",
  rating: 5
}, {
  name: "Carlos Rodríguez",
  business: "Restaurante El Fogón",
  location: "Valladolid",
  text: "Nos hicieron el branding completo y la carta digital. El resultado superó nuestras expectativas. Ahora nuestros clientes nos reconocen al instante.",
  rating: 5
}, {
  name: "Laura Martínez",
  business: "FitZone Gym",
  location: "Palencia",
  text: "La app que desarrollaron para reservas de clases ha sido un éxito total. Nuestros socios la usan a diario y las reseñas son excelentes.",
  rating: 5
}];
const TestimonialsSection = () => {
  const {
    ref,
    isVisible
  } = useScrollReveal({
    threshold: 0.1
  });
  return;
};
export default TestimonialsSection;