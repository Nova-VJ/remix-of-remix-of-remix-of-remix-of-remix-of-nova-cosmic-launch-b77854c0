import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2, LogIn, ExternalLink, MessageCircle, ShoppingCart, Check, X, ChevronUp, Globe, Smartphone, Share2, Palette, TrendingUp, BarChart3, Briefcase, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { useSaraChat } from '@/hooks/useSaraChat';
import { Badge } from '@/components/ui/badge';
import Linkify from 'linkify-react';
import { FORM_URL, WHATSAPP_URL } from '@/config/env';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
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
  return text
    .replace(/\[LINK_FORMULARIO\]/gi, FORM_URL)
    .replace(/\[FORMULARIO\]/gi, FORM_URL)
    .replace(/\[LINK_WHATSAPP\]/gi, WHATSAPP_URL)
    .replace(/\[WHATSAPP\]/gi, WHATSAPP_URL)
    // Catch any literal formulario URLs Sara might generate
    .replace(/https?:\/\/[^\s]*formulario[^\s]*/gi, FORM_URL);
};

const extractCartProposal = (text: string): { cleanText: string; proposal: CartProposal | null } => {
  const match = text.match(/\[PROPUESTA_CARRITO:(.*?)\]/s);
  if (!match) return { cleanText: text, proposal: null };
  try {
    const proposal: CartProposal = JSON.parse(match[1]);
    const cleanText = text.replace(/\[PROPUESTA_CARRITO:.*?\]/s, '').trim();
    return { cleanText, proposal };
  } catch {
    return { cleanText: text, proposal: null };
  }
};

const isWhatsAppLink = (url: string) => url.includes('wa.me') || url.includes('whatsapp');
const isFormLink = (url: string) => url.includes('openBriefing=true');

const AIChatMode = ({ onBack }: AIChatModeProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [pendingProposal, setPendingProposal] = useState<CartProposal | null>(null);
  const [proposalAccepted, setProposalAccepted] = useState(false);
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

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'assistant') {
      const raw = normalizeSaraReply(lastMsg.content);
      const { proposal } = extractCartProposal(raw);
      if (proposal && !proposalAccepted) {
        setPendingProposal(proposal);
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || demoLimitReached) return;
    const message = inputValue;
    setInputValue('');
    setProposalAccepted(false);
    setPendingProposal(null);
    await sendMessage(message);
  };

  const handleLogin = () => { navigate('/auth'); setShowLoginDialog(false); };
  const handleRegister = () => { navigate('/auth?mode=register'); setShowLoginDialog(false); };

  const handleScrollUp = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleAcceptProposal = () => {
    if (!pendingProposal) return;
    pendingProposal.items.forEach(item => addItem(item));
    setProposalAccepted(true);
    setPendingProposal(null);
    toast({
      title: '🛒 Añadido al carrito',
      description: `${pendingProposal.items.length} servicio(s) añadido(s). Total: ${pendingProposal.items.reduce((s, i) => s + i.price, 0).toLocaleString('es-ES')}€`,
    });
  };

  const handleRejectProposal = () => {
    setPendingProposal(null);
    toast({ title: 'Sin problema', description: 'Puedes pedirme otra recomendación cuando quieras.' });
  };

  const renderLink = ({ attributes, content }: { attributes: any; content: string }) => {
    const { href, ...props } = attributes;
    if (isWhatsAppLink(href)) {
      return (
        <a href={href} {...props} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 mt-1 rounded-lg bg-[#25D366] text-primary-foreground font-medium text-xs hover:bg-[#20BD5A] transition-colors no-underline">
          <MessageCircle className="w-3.5 h-3.5" /> Abrir WhatsApp
        </a>
      );
    }
    if (isFormLink(href)) {
      return (
        <a href={href} {...props}
          className="inline-flex items-center gap-1 px-3 py-1.5 mt-1 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-colors no-underline">
          <ExternalLink className="w-3.5 h-3.5" /> Abrir formulario
        </a>
      );
    }
    return (
      <a href={href} {...props} target="_blank" rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80 transition-colors">{content}</a>
    );
  };

  const linkifyOptions = { render: renderLink, target: '_blank', rel: 'noopener noreferrer' };

  const proposalTotal = pendingProposal?.items.reduce((s, i) => s + i.price, 0) ?? 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-8 px-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium">Chat con Sara</span>
        {isDemo && (
          <Badge variant="secondary" className="ml-auto text-xs">
            Demo: {3 - demoCount} mensajes
          </Badge>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <p>¡Hola! 👋 Soy Sara, tu asistente virtual.</p>
            <p className="mt-2">Pregúntame sobre nuestros servicios, precios o cualquier duda.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          const raw = isBot ? normalizeSaraReply(msg.content) : msg.content;
          const { cleanText } = isBot ? extractCartProposal(raw) : { cleanText: raw };

          return (
            <div key={msg.id} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm break-words overflow-hidden ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}>
                <div className="whitespace-pre-wrap break-words">
                  {isBot ? <Linkify options={linkifyOptions}>{cleanText}</Linkify> : <p>{cleanText}</p>}
                </div>
                <span className="text-[10px] opacity-60 mt-1 block">
                  {msg.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Cart Proposal Card - Ecoland style */}
        {pendingProposal && (
          <div className="mb-3 animate-in slide-in-from-bottom-2 duration-300">
            <div className="border border-primary/30 bg-card rounded-xl overflow-hidden shadow-sm">
              {/* Header */}
              <div className="bg-primary/10 px-3 py-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Recomendación de Sara</span>
              </div>

              {/* Description */}
              <div className="px-3 pt-2">
                <p className="text-xs text-muted-foreground">{pendingProposal.description}</p>
              </div>

              {/* Items */}
              <div className="px-3 py-2 space-y-1.5">
                {pendingProposal.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-2.5 py-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary shrink-0">
                      {SERVICE_ICONS[item.id] || <ShoppingCart className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-medium flex-1 truncate">{item.name}</span>
                    <span className="text-xs font-bold text-primary whitespace-nowrap">{item.price.toLocaleString('es-ES')}€</span>
                  </div>
                ))}
              </div>

              {/* Total + Actions */}
              <div className="px-3 pb-3 space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-medium text-muted-foreground">Total estimado</span>
                  <span className="text-sm font-bold text-primary">{proposalTotal.toLocaleString('es-ES')}€</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 h-8 text-xs gap-1.5" onClick={handleAcceptProposal}>
                    <ShoppingCart className="w-3.5 h-3.5" /> Añadir al carrito
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs px-3 text-muted-foreground" onClick={handleRejectProposal}>
                    No, gracias
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accepted feedback */}
        {proposalAccepted && (
          <div className="mb-3 flex justify-start">
            <div className="bg-primary/10 text-primary rounded-lg px-3 py-2 text-xs flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Servicios añadidos al carrito
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-muted rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        {error && <div className="text-center text-destructive text-xs py-2">{error}</div>}
      </ScrollArea>

      {/* Scroll-back button when demo limit reached */}
      {demoLimitReached && messages.length > 0 && (
        <div className="px-3 pb-2">
          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-8" onClick={handleScrollUp}>
            <ChevronUp className="w-3.5 h-3.5" />
            Ver conversación anterior
          </Button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={demoLimitReached ? "Inicia sesión para continuar" : "Escribe tu mensaje..."}
            disabled={isLoading || demoLimitReached}
            className="flex-1 text-sm"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim() || demoLimitReached}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Límite de demo alcanzado
            </DialogTitle>
            <DialogDescription>
              Has usado los 3 mensajes gratuitos del modo demo.
              Inicia sesión o crea una cuenta para continuar chateando con Sara sin límites.
              <br /><br />
              <span className="text-xs text-muted-foreground">
                Tu conversación anterior se guardará automáticamente en tu cuenta.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleRegister} className="w-full sm:w-auto">Crear cuenta</Button>
            <Button onClick={handleLogin} className="w-full sm:w-auto">Iniciar sesión</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIChatMode;
