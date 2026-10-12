import { X } from 'lucide-react';
import saraIcon from '@/assets/sara-icon.webp';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatButton = ({ isOpen, onClick }: ChatButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group fixed bottom-24 md:bottom-4 right-4 z-40 flex items-center gap-2 transition-all duration-300 hover:scale-105"
      aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente virtual Sara'}
    >
      {isOpen ? (
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
          style={{ backgroundImage: 'var(--gradient-purple)' }}
        >
          <X className="h-6 w-6 text-white" />
        </div>
      ) : (
        <>
          <span className="hidden md:block text-sm font-medium text-foreground bg-background/90 backdrop-blur-sm px-3.5 py-2 rounded-full shadow-md border border-border/60">
            ¿Hablamos? Soy Sara
          </span>
          <span className="relative">
            <img
              src={saraIcon}
              alt="Sara - Asistente Virtual"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover ring-2 ring-primary/40 shadow-lg shadow-primary/30 transition-shadow group-hover:shadow-xl cursor-pointer"
            />
            <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-background" />
          </span>
        </>
      )}
    </button>
  );
};

export default ChatButton;
