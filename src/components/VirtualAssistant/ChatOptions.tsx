import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
}

interface ChatOptionsProps {
  options: ChatOption[];
  onSelect: (optionId: string) => void;
  columns?: 1 | 2;
}

const ChatOptions = ({ options, onSelect, columns = 1 }: ChatOptionsProps) => {
  if (columns === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card/60 p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {option.icon && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {option.icon}
              </span>
            )}
            <span className="text-xs font-medium leading-snug text-foreground">{option.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-border/60 bg-card/40 divide-y divide-border/50">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          className={cn(
            "group flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors",
            "hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
          )}
        >
          {option.icon && <span className="flex-shrink-0 text-primary">{option.icon}</span>}
          <span className="flex-1 line-clamp-2 text-[13px] text-foreground">{option.label}</span>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </button>
      ))}
    </div>
  );
};

export default ChatOptions;
