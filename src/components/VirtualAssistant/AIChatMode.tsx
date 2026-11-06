import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, LogIn, MessageCircle, ShoppingCart, Check, ChevronUp, Globe, Smartphone, Share2, Palette, TrendingUp, BarChart3, Briefcase, Gem, FileText, Tag } from 'lucide-react';
import VoiceRecordButton from './VoiceRecordButton';
import { Button } from '@/components/ui/button';

import { useNavigate } from 'react-router-dom';
import { useSaraChat, DEMO_LIMIT } from '@/hooks/useSaraChat';
import Linkify from 'linkify-react';
import { WHATSAPP_URL } from '@/config/env';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import BriefingFormModal from '@/components/BriefingForm/LazyBriefingFormModal';
import saraAvatar from '@/assets/sara-avatar.webp';
import { useTranslation } from '@/i18n';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AIChatModeProps {
  onBack: () => void;
}

interface CartProposal {
  items: { id: string; name: string; price: number; type: 'service' | 'package' }[];
  description: string;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  web: <Globe className="w-4 h-4" />,
  apps: <Smartphone className="w-4 h-4" />,
  social: <Share2 className="w-4 h-4" />,
  branding: <Palette className="w-4 h-4" />,
  marketing: <TrendingUp className="w-4 h-4" />,
  sem: <BarChart3 className="w-4 h-4" />,
  'pkg-pro': <Briefcase className="w-4 h-4" />,
  'pkg-plus': <Gem className="w-4 h-4" />,
};

const normalizeSaraReply = (text: string): string => {
  // Remove all form-related URLs and placeholders - we'll handle them as buttons
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$2')
    .replace(/\[LINK_WHATSAPP\]/gi, WHATSAPP_URL)
    .replace(/\[WHATSAPP\]/gi, WHATSAPP_URL)
    // Replace form placeholders with a special marker that won't be a URL
    .replace(/\[LINK_FORMULARIO\]/gi, '##OPEN_FORM##')
    .replace(/\[FORMULARIO\]/gi, '##OPEN_FORM##')
    // Catch any literal formulario URLs Sara might generate and replace with marker
    .replace(/https?:\/\/[^\s]*(?:formulario|openBriefing)[^\s]*/gi, '##OPEN_FORM##')
    .replace(/\*\*/g, '');
};

const getCatalogItems = (isEn: boolean): Record<string, { id: string; name: string; price: number; type: 'service' | 'package' }> => ({
  'pkg-plus': { id: 'pkg-plus', name: isEn ? 'Plus Package' : 'Paquete Plus', price: 1900, type: 'package' },
  'pkg-pro': { id: 'pkg-pro', name: isEn ? 'Pro Package' : 'Paquete Pro', price: 800, type: 'package' },
  apps: { id: 'apps', name: isEn ? 'Mobile App' : 'Aplicación Móvil', price: 1700, type: 'service' },
  web: { id: 'web', name: isEn ? 'Professional Website' : 'Página Web Profesional', price: 600, type: 'service' },
  social: { id: 'social', name: isEn ? 'Social Media (monthly)' : 'Redes Sociales (mensual)', price: 500, type: 'service' },
  branding: { id: 'branding', name: isEn ? 'Brand Identity' : 'Branding Profesional', price: 200, type: 'service' },
  marketing: { id: 'marketing', name: isEn ? 'Digital Marketing' : 'Marketing Digital', price: 200, type: 'service' },
  sem: { id: 'sem', name: isEn ? 'SEM / Google Ads' : 'SEM - Posicionamiento Google', price: 150, type: 'service' },
});

const CATALOG_PATTERNS = [
  { id: 'pkg-plus', regex: /\b(?:paquete|plan|pack|package)\s+plus\b/i },
  { id: 'pkg-pro', regex: /\b(?:paquete|plan|pack|package)\s+pro\b/i },
  { id: 'apps', regex: /\b(?:aplicaci[oó]n(?:es)?(?:\s+m[oó]vil(?:es)?)?|app(?:s)?(?:\s+m[oó]vil(?:es)?)?|mobile\s+app(?:s)?)\b/i },
  { id: 'web', regex: /\b(?:p[aá]gina(?:s)?\s+web|sitio(?:s)?\s+web|desarrollo\s+web|dise[ñn]o\s+web|website|web\s+design)\b/i },
  { id: 'social', regex: /\b(?:redes\s+sociales|community\s+manager|gesti[oó]n\s+de\s+redes|social\s+media)\b/i },
  { id: 'branding', regex: /\b(?:branding|identidad\s+visual|dise[ñn]o\s+de\s+logo(?:tipo)?|brand\s+identity)\b/i },
  { id: 'marketing', regex: /\b(?:marketing\s+digital|estrategia\s+digital|digital\s+marketing)\b/i },
  { id: 'sem', regex: /\b(?:sem|google\s+ads|publicidad\s+en\s+google|paid\s+ads)\b/i },
];

const extractCartProposal = (text: string, isEn: boolean): { cleanText: string; proposal: CartProposal | null } => {
  const catalog = getCatalogItems(isEn);
  const items: CartProposal['items'] = [];
  const seenIds = new Set<string>();

  const addItem = (item: { id: string; name?: string; price?: number; type?: 'service' | 'package' }) => {
    const catalogItem = catalog[item.id];
    if (catalogItem && !seenIds.has(item.id)) {
      seenIds.add(item.id);
      items.push({
        id: item.id,
        name: item.name || catalogItem.name,
        price: typeof item.price === 'number' ? item.price : catalogItem.price,
        type: item.type || catalogItem.type,
      });
    }
  };

  // 1. Explicit tag format: [PROPUESTA_CARRITO: {...}]
  const startTag = '[PROPUESTA_CARRITO:';
  if (text.includes(startTag)) {
    try {
      const idx = text.indexOf(startTag);
      const afterTag = text.substring(idx + startTag.length);
      const endIdx = afterTag.indexOf(']');
      let jsonStr = endIdx !== -1 ? afterTag.substring(0, endIdx) : afterTag;
      jsonStr = jsonStr.trim();
      const lastBrace = jsonStr.lastIndexOf('}');
      if (lastBrace !== -1) {
        jsonStr = jsonStr.substring(0, lastBrace + 1);
      }
      const parsed = JSON.parse(jsonStr);
      if (parsed.items && Array.isArray(parsed.items)) {
        for (const item of parsed.items) {
          if (item && item.id) addItem(item);
        }
      }
    } catch (e) {
      // Fallback below
    }
  }

  // 2. Natural language matching
  for (const pattern of CATALOG_PATTERNS) {
    if (pattern.regex.test(text)) {
      addItem({ id: pattern.id });
    }
  }

  // 3. Clean the text completely
  let cleanText = text;
  const firstTagIdx = cleanText.indexOf(startTag);
  if (firstTagIdx !== -1) {
    cleanText = cleanText.substring(0, firstTagIdx);
  }

  cleanText = cleanText
    .replace(/\[PROPUESTA_CARRITO:[\s\S]*?(?:\]|$)/gi, '')
    .replace(/\{[\s\S]*?"(?:id|items|description)"[\s\S]*?\}/gi, '')
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (trimmed.startsWith('{') || trimmed.startsWith('}') || trimmed.startsWith('[') || trimmed.startsWith(']')) return false;
      if (/["'](?:id|items|price|type)["']\s*:/i.test(trimmed)) return false;
      return true;
    })
    .join('\n')
    .replace(/,?\s*\{[\s\S]*$/g, '')
    .replace(/,?\s*\[[\s\S]*$/g, '')
    .replace(/[}\]]\s*,?\s*$/g, '')
    .replace(/[,\s]+$/, '')
    .trim();

  const proposal = items.length > 0 ? { items, description: isEn ? 'Recommended Services' : 'Servicios recomendados' } : null;
  return { cleanText, proposal };
};

const isWhatsAppLink = (url: string) => url.includes('wa.me') || url.includes('whatsapp');

const SaraBubbleAvatar = () => (
  <img src={saraAvatar} alt="" className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover" />
);

const AIChatMode = ({ onBack }: AIChatModeProps) => {
  const { t, formatCurrency, isEn } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { messages, isLoading, error, sendMessage, isDemo, demoCount, demoLimitReached } = useSaraChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (demoLimitReached) setShowLoginDialog(true);
  }, [demoLimitReached]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || demoLimitReached) return;
    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleLogin = () => { navigate('/auth'); setShowLoginDialog(false); };
  const handleRegister = () => { navigate('/auth?mode=register'); setShowLoginDialog(false); };

  const handleScrollUp = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleAddSingleItem = (item: CartProposal['items'][0]) => {
    addItem(item);
    setAddedItems(prev => new Set(prev).add(item.id));
    toast({
      title: `🛒 ${t.chatSara.addedToCart}`,
      description: `${item.name} — ${formatCurrency(item.price)}`,
    });
  };

  const renderLink = ({ attributes, content }: { attributes: any; content: string }) => {
    const { href, ...props } = attributes;
    if (isWhatsAppLink(href)) {
      return (
        <a href={href} {...props} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 mt-1 rounded-lg bg-[#25D366] text-primary-foreground font-medium text-xs hover:bg-[#20BD5A] transition-colors no-underline">
          <MessageCircle className="w-3.5 h-3.5" /> {t.chatSara.openWhatsapp}
        </a>
      );
    }
    return (
      <a href={href} {...props} target="_blank" rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80 transition-colors text-xs break-all">{content}</a>
    );
  };

  const linkifyOptions = { render: renderLink, target: '_blank', rel: 'noopener noreferrer' };

  // Render text with ##OPEN_FORM## replaced by buttons
  const renderMessageContent = (text: string) => {
    if (!text.includes('##OPEN_FORM##')) {
      return <Linkify options={linkifyOptions}>{text}</Linkify>;
    }
    
    const parts = text.split('##OPEN_FORM##');
    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            <Linkify options={linkifyOptions}>{part}</Linkify>
            {i < parts.length - 1 && (
              <button
                onClick={() => setShowBriefingModal(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 mt-1 mb-1 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> {t.chatSara.openBriefing}
              </button>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/20 px-2 py-1.5">
        <button
          type="button"
          onClick={onBack}
          aria-label={isEn ? "Back" : "Volver"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium">Chat con Sara</span>
        {isDemo && (
          <span className="ml-auto pr-2 text-[11px] text-muted-foreground">
            {isEn ? `${Math.max(0, DEMO_LIMIT - demoCount)} messages left today` : `Te quedan ${Math.max(0, DEMO_LIMIT - demoCount)} mensajes hoy`}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4" ref={scrollRef} style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
        {messages.length === 0 && (
          <div className="py-5 text-center">
            <img
              src={saraAvatar}
              alt=""
              className="mx-auto mb-3 h-16 w-16 rounded-full object-cover ring-4 ring-primary/15 shadow-lg shadow-primary/20"
            />
            <p className="text-base font-semibold text-foreground">{t.chatSara.welcomeTitle}</p>
            <p className="mx-auto mt-1 max-w-[260px] text-xs leading-relaxed text-muted-foreground">
              {t.chatSara.welcomeSubtitle}
            </p>
          </div>
        )}

        {messages.length <= 1 && (
          <div className="mb-4 mt-2 space-y-2">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t.chatSara.faqPillsTitle}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {t.chatSara.pills.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading || demoLimitReached}
                  onClick={() => sendMessage(item.prompt)}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-2.5 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-50"
                >
                  <span className="leading-snug">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          const raw = isBot ? normalizeSaraReply(msg.content) : msg.content;
          const { cleanText, proposal } = isBot ? extractCartProposal(raw, isEn) : { cleanText: raw, proposal: null };

          return (
            <div key={msg.id} className="mb-3">
              <div className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {isBot && <SaraBubbleAvatar />}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-tr-md shadow-md shadow-primary/20'
                      : 'bg-muted/70 text-foreground rounded-tl-md border border-border/40'
                  }`}
                  style={msg.role === 'user' ? { backgroundImage: 'var(--gradient-purple)' } : undefined}
                >
                  <div className="whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                    {isBot ? renderMessageContent(cleanText) : <p>{cleanText}</p>}
                  </div>
                  <span className={`text-[10px] opacity-60 mt-1 block ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {msg.createdAt.toLocaleTimeString(isEn ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Inline product items */}
              {proposal && (
                <div className="mt-2 ml-9 space-y-1.5 max-w-[82%]">
                  {proposal.items.map((item, i) => {
                    const isAdded = addedItems.has(item.id);
                    return (
                      <div key={i} className="flex items-center gap-2 bg-card/60 border border-border/60 rounded-xl px-2.5 py-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary shrink-0">
                          {SERVICE_ICONS[item.id] || <ShoppingCart className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-medium flex-1 truncate">{item.name}</span>
                        <span className="text-xs font-bold text-primary whitespace-nowrap">{formatCurrency(item.price)}</span>
                        <button
                          onClick={() => handleAddSingleItem(item)}
                          disabled={isAdded}
                          className={`shrink-0 p-1 rounded-md transition-colors ${
                            isAdded 
                              ? 'text-primary bg-primary/10' 
                              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                          }`}
                          title={isAdded ? t.chatSara.addedToCart : t.chatSara.addToCart}
                        >
                          {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start gap-2 mb-3">
            <SaraBubbleAvatar />
            <div className="bg-muted/70 border border-border/40 rounded-2xl rounded-tl-md px-3.5 py-2.5 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">{t.chatSara.typingIndicator}</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {error && <div className="text-center text-destructive text-xs py-2">{error}</div>}
      </div>

      {/* Scroll-back button when demo limit reached */}
      {demoLimitReached && messages.length > 0 && (
        <div className="px-3 pb-2">
          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-8" onClick={handleScrollUp}>
            <ChevronUp className="w-3.5 h-3.5" />
            {isEn ? "View previous conversation" : "Ver conversación anterior"}
          </Button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border/60 px-3 pt-3 pb-2">
        <div className="flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 py-1 pl-4 pr-1 transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={demoLimitReached ? (isEn ? "Log in to continue" : "Inicia sesión para continuar") : (isEn ? "Type your message..." : "Escribe tu mensaje...")}
            disabled={isLoading || demoLimitReached}
            aria-label="Mensaje para Sara"
            className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
          />
          <VoiceRecordButton
            onTranscription={async (text) => {
              setInputValue('');
              await sendMessage(text);
            }}
            disabled={isLoading || demoLimitReached}
          />
          <Button
            type="submit"
            size="icon"
            aria-label={isEn ? "Send message" : "Enviar mensaje"}
            className="h-9 w-9 shrink-0 rounded-full"
            disabled={isLoading || !inputValue.trim() || demoLimitReached}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          {isEn
            ? "Sara is an AI assistant and may make mistakes. Final proposals are confirmed by our team."
            : "Sara es una IA y puede equivocarse. El presupuesto final te lo confirma nuestro equipo."}
        </p>
      </form>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              {isEn ? "You have reached today's limit" : "Has llegado al límite de hoy"}
            </DialogTitle>
            <DialogDescription>
              {isEn
                ? `You have reached your ${DEMO_LIMIT} free daily messages. Log in or create an account to keep chatting with Sara, or return tomorrow.`
                : `Has usado los ${DEMO_LIMIT} mensajes gratuitos de hoy. Inicia sesión o crea una cuenta para seguir chateando con Sara, o vuelve mañana.`}
              <br /><br />
              <span className="text-xs text-muted-foreground">
                {isEn ? "Your conversation history will be saved to your account." : "Tu conversación anterior se guardará automáticamente en tu cuenta."}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleRegister} className="w-full sm:w-auto">
              {isEn ? "Create Account" : "Crear cuenta"}
            </Button>
            <Button onClick={handleLogin} className="w-full sm:w-auto">
              {isEn ? "Log In" : "Iniciar sesión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Briefing Form Modal */}
      <BriefingFormModal 
        open={showBriefingModal} 
        onOpenChange={setShowBriefingModal} 
      />
    </div>
  );
};

export default AIChatMode;
