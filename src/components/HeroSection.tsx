import { useRef, useEffect } from 'react';
import loopVideo from '@/assets/loop.mp4';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-end overflow-hidden pb-16 sm:pb-24">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={loopVideo} type="video/mp4" />
      </video>

      {/* Dark overlay - subtle bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      {/* Content - positioned at bottom */}
      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-foreground/90 mb-6 font-light">
          Diseño, estrategia y tecnología para vender más.
        </p>

        {/* CTA Button */}
        <a
          href={WHATSAPP_GENERAL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glow inline-flex items-center gap-2 sm:gap-3 text-primary-foreground text-sm sm:text-base px-5 sm:px-8 py-3 sm:py-4"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="text-center leading-tight">Cuéntanos tu proyecto<br className="sm:hidden" /><span className="hidden sm:inline"> · </span>Pide presupuesto gratis</span>
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 rounded-full border-2 border-foreground/40 flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-foreground/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
