import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const StickyMobileCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-border bg-background/85 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
      <button
        type="button"
        onClick={() => navigate('/?openBriefing=true')}
        className="btn-glow-sm flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-primary-foreground"
      >
        <span className="font-semibold">Pide presupuesto</span>
        <ArrowRight className="h-4 w-4" />
      </button>
      <a
        href={WHATSAPP_GENERAL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="flex w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-[#25D366] transition-colors active:bg-accent"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </div>
  );
};

export default StickyMobileCTA;
