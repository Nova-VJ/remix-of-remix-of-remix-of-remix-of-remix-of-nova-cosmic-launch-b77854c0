import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgePercent, Bot, FileText, LayoutGrid, Sparkles, X } from 'lucide-react';
import metodoNovaIcon from '@/assets/metodo-nova-icon.webp';
import { scrollToSectionId } from '@/lib/scroll';
import { cn } from '@/lib/utils';

const DISMISSED_KEY = 'nova-guide-dismissed';
const SNOOZE_DAYS = 14;
const SHOW_AFTER_MS = 5000;

type Choice = 'own' | 'services' | 'projects' | 'budget' | 'sara';

const OPTIONS: { id: Choice; label: string; icon: React.ElementType; highlight?: boolean }[] = [
  { id: 'own', label: 'Dejar de pagar comisiones a las apps', icon: BadgePercent, highlight: true },
  { id: 'services', label: 'Una web, app, marca o redes', icon: LayoutGrid },
  { id: 'projects', label: 'Ver proyectos que hemos hecho', icon: Sparkles },
  { id: 'budget', label: 'Pedir presupuesto ya', icon: FileText },
  { id: 'sara', label: 'Preguntar a Sara', icon: Bot },
];

const recentlyDismissed = () => {
  try {
    const at = Number(localStorage.getItem(DISMISSED_KEY));
    return at > 0 && Date.now() - at < SNOOZE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

/**
 * Small, non-blocking "what brings you here?" card. Appears a few seconds after
 * arriving (never over the cookie banner or a dialog) and takes the visitor
 * straight to what they came for. Closing it hides it for two weeks.
 */
const WelcomeGuide = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (recentlyDismissed()) return;
    const start = Date.now();
    const timer = window.setInterval(() => {
      if (Date.now() - start < SHOW_AFTER_MS) return;
      const busy = document.querySelector('.cookie-banner, [role="dialog"]');
      if (!busy) {
        setVisible(true);
        window.clearInterval(timer);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      /* private mode: just hide it for now */
    }
  };

  const choose = (choice: Choice) => {
    dismiss();
    switch (choice) {
      case 'own':
        scrollToSectionId('sistema-propio');
        break;
      case 'services':
        scrollToSectionId('servicios');
        break;
      case 'projects':
        scrollToSectionId('proyectos');
        break;
      case 'budget':
        navigate('/?openBriefing=true');
        break;
      case 'sara':
        window.dispatchEvent(new CustomEvent('nova:open-sara'));
        break;
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="¿Qué te trae por aquí?"
      className={cn(
        'welcome-guide fixed bottom-[5.5rem] left-3 right-20 z-40 md:bottom-24 md:left-auto md:right-4 md:w-[21rem]',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500'
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-background/95 shadow-[0_24px_60px_-20px_hsl(224_40%_12%/0.35)] backdrop-blur-xl">
        <div className="flex items-start gap-3 p-4 pb-3">
          <img src={metodoNovaIcon} alt="" width={36} height={36} className="h-9 w-9 shrink-0 object-contain" />
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-foreground">¿Qué te trae por aquí?</p>
            <p className="text-xs text-muted-foreground">Te llevamos directo a lo que buscas.</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="-mr-1 -mt-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="space-y-1 px-2 pb-2">
          {OPTIONS.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => choose(o.id)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors',
                  o.highlight ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100' : 'text-foreground hover:bg-accent'
                )}
              >
                <o.icon className={cn('h-4 w-4 shrink-0', o.highlight ? 'text-emerald-600' : 'text-primary')} />
                <span className="flex-1">{o.label}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={dismiss}
          className="w-full border-t border-border py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          Solo estoy mirando
        </button>
      </div>
    </aside>
  );
};

export default WelcomeGuide;
