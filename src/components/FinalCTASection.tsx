import { MessageCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";
const FinalCTASection = () => {
  const {
    ref,
    isVisible
  } = useScrollReveal({
    threshold: 0.1
  });
  return <section ref={ref as React.RefObject<HTMLElement>} className="relative py-24 px-6 overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className={`text-3xl md:text-5xl font-bold text-foreground mb-4 text-glow transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          ¿Listo para empezar?
        </h2>
        
        <p className={`text-lg md:text-xl text-muted-foreground mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
        transitionDelay: '100ms'
      }}>
          Cuéntanos tu idea y la convertimos en resultados reales.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{
        transitionDelay: '200ms'
      }}>
          <a href={WHATSAPP_GENERAL} target="_blank" rel="noopener noreferrer" className="btn-glow inline-flex items-center gap-3 text-primary-foreground px-8 py-4">
            <MessageCircle className="w-5 h-5" />
            <span>Cuéntanos tu proyecto</span>
          </a>
          
          <a href={WHATSAPP_GENERAL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 text-foreground/90 hover:bg-background/20 hover:border-primary/50 transition-all duration-300">
            <MessageCircle className="w-5 h-5" />
            <span> Chatea por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>;
};
export default FinalCTASection;