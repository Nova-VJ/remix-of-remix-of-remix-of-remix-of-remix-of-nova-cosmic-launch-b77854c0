import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { useSaraChat } from '@/hooks/useSaraChat';
import { Badge } from '@/components/ui/badge';
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

const AIChatMode = ({ onBack }: AIChatModeProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    isDemo,
    demoCount,
    demoLimitReached
  } = useSaraChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (demoLimitReached) {
      setShowLoginDialog(true);
    }
  }, [demoLimitReached]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || demoLimitReached) return;

    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleLogin = () => {
    navigate('/auth');
    setShowLoginDialog(false);
  };

  const handleRegister = () => {
    navigate('/auth?mode=register');
    setShowLoginDialog(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="h-8 px-2"
        >
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
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-[10px] opacity-60 mt-1 block">
                {msg.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-muted rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-destructive text-xs py-2">
            {error}
          </div>
        )}
      </ScrollArea>

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
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !inputValue.trim() || demoLimitReached}
          >
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
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleRegister} className="w-full sm:w-auto">
              Crear cuenta
            </Button>
            <Button onClick={handleLogin} className="w-full sm:w-auto">
              Iniciar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIChatMode;
