import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatButton = ({ isOpen, onClick }: ChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 h-auto px-4 py-3 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <>
          <Bot className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">Asistente Virtual</span>
        </>
      )}
    </Button>
  );
};

export default ChatButton;
