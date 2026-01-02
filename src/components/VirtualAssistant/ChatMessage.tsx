import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: Date;
}

const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
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
        <p className="whitespace-pre-wrap">{message}</p>
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
