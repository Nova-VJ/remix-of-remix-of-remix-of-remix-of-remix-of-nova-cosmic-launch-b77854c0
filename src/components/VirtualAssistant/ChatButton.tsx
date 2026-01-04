import { X } from 'lucide-react';
import saraIcon from '@/assets/sara-icon.png';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatButton = ({ isOpen, onClick }: ChatButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 sm:bottom-4 right-4 z-50 flex items-center gap-2 transition-all duration-300 hover:scale-105"
      aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente virtual Sara'}
    >
      {isOpen ? (
        <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <X className="h-6 w-6 text-primary-foreground" />
        </div>
      ) : (
        <>
          <span className="hidden sm:block text-sm font-medium text-foreground bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-border/50">
            Asistente Virtual
          </span>
          <img 
            src={saraIcon} 
            alt="Sara - Asistente Virtual" 
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover shadow-lg border-2 border-primary/30"
          />
        </>
      )}
    </button>
  );
};

export default ChatButton;
