import { MessageCircle } from 'lucide-react';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const StickyMobileCTA = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-background/80 backdrop-blur-md border-t border-border md:hidden">
      <a
        href={WHATSAPP_GENERAL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-glow-sm w-full flex items-center justify-center gap-2 text-primary-foreground py-3 rounded-xl"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-semibold">Pide presupuesto</span>
      </a>
    </div>
  );
};

export default StickyMobileCTA;
