import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { WHATSAPP_URL } from '@/config/env';

const StickyMobileCTA = () => {
  const { t, isEn } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-border bg-background/85 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
      <button
        type="button"
        onClick={() => navigate('/?openBriefing=true')}
        className="btn-glow-sm flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-primary-foreground"
      >
        <span className="font-semibold">{t.stickyCta.quote}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isEn ? "Chat on WhatsApp" : "Escríbenos por WhatsApp"}
        className="flex w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-[#25D366] transition-colors active:bg-accent"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </div>
  );
};

export default StickyMobileCTA;
