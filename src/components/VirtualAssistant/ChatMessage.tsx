import { cn } from '@/lib/utils';
import Linkify from 'linkify-react';
import { ExternalLink, MessageCircle } from 'lucide-react';
import { FORM_URL, WHATSAPP_URL } from '@/config/env';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: Date;
}

// Normalize placeholders in Sara's responses to actual URLs
const normalizeSaraReply = (text: string): string => {
  return text
    .replace(/\[LINK_FORMULARIO\]/gi, FORM_URL)
    .replace(/\[FORMULARIO\]/gi, FORM_URL)
    .replace(/\[LINK_WHATSAPP\]/gi, WHATSAPP_URL)
    .replace(/\[WHATSAPP\]/gi, WHATSAPP_URL);
};

// Check if URL is a WhatsApp link
const isWhatsAppLink = (url: string): boolean => {
  return url.includes('wa.me') || url.includes('whatsapp');
};

// Check if URL is the form link
const isFormLink = (url: string): boolean => {
  return url.includes('openBriefing=true');
};

const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  // Normalize message if from bot
  const normalizedMessage = isBot ? normalizeSaraReply(message) : message;

  // Custom link renderer for Linkify
  const renderLink = ({ attributes, content }: { attributes: any; content: string }) => {
    const { href, ...props } = attributes;
    const isWhatsApp = isWhatsAppLink(href);
    const isForm = isFormLink(href);

    if (isWhatsApp) {
      return (
        <a
          href={href}
          {...props}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 mt-1 rounded-lg bg-[#25D366] text-white font-medium text-xs hover:bg-[#20BD5A] transition-colors no-underline"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Abrir WhatsApp
        </a>
      );
    }

    if (isForm) {
      return (
        <a
          href={href}
          {...props}
          className="inline-flex items-center gap-1 px-3 py-1.5 mt-1 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-colors no-underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir formulario
        </a>
      );
    }

    // Default link style
    return (
      <a
        href={href}
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80 transition-colors"
      >
        {content}
      </a>
    );
  };

  const linkifyOptions = {
    render: renderLink,
    target: '_blank',
    rel: 'noopener noreferrer',
  };

  return (
    <div className={cn(
      "flex w-full mb-3",
      isBot ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
        isBot 
          ? "bg-muted text-foreground rounded-bl-sm" 
          : "bg-primary text-primary-foreground rounded-br-sm"
      )}>
        <div className="whitespace-pre-wrap">
          {isBot ? (
            <Linkify options={linkifyOptions}>{normalizedMessage}</Linkify>
          ) : (
            <p>{normalizedMessage}</p>
          )}
        </div>
        {timestamp && (
          <span className="text-xs opacity-60 mt-1 block">
            {timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
