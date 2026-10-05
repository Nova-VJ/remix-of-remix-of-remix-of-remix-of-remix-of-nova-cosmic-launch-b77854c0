import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import loopVideo from '@/assets/loop.mp4';
import { MessageCircle, Zap, TrendingUp, BarChart3, ArrowDown, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";
const benefits = [{
  icon: Zap,
  text: "Entrega rápida"
}, {
  icon: TrendingUp,
  text: "Enfoque en conversión"
}, {
  icon: BarChart3,
  text: "Seguimiento real de resultados"
}];
const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    user
  } = useAuth();
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented
      });
    }
  }, []);
  const scrollToServices = () => {
    document.getElementById('servicios')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 pt-20">
      {/* Background video */}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
        <source src={loopVideo} type="video/mp4" className="ml-[140px] mt-[160px]" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-0 mb-0 my-[170px] mt-[270px]">
        {/* Main headline */}
        

        {/* Subheadline */}
        

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
          {benefits.map((benefit, index) => <div key={index} className="flex items-center gap-2 text-foreground/80">
              <benefit.icon className="w-5 h-5 text-primary" />
              <span className="text-sm sm:text-base">{benefit.text}</span>
            </div>)}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href={WHATSAPP_GENERAL} target="_blank" rel="noopener noreferrer" className="btn-glow inline-flex items-center gap-2 sm:gap-3 text-primary-foreground text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            <span>Cuéntanos tu proyecto</span>
          </a>
          
          <button onClick={scrollToServices} className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 text-foreground/90 hover:bg-background/20 hover:border-primary/50 transition-all duration-300">
            <ArrowDown className="w-5 h-5" />
            <span>Ver servicios</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 rounded-full border-2 border-foreground/40 flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-foreground/60 rounded-full" />
        </div>
      </div>
    </section>;
};
export default HeroSection;