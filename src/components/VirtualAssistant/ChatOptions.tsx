import { Button } from '@/components/ui/button';
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
  return (
    <div className={cn(
      "grid gap-2 mt-3",
      columns === 2 ? "grid-cols-2" : "grid-cols-1"
    )}>
      {options.map((option) => (
        <Button
          key={option.id}
          variant={option.variant || "outline"}
          size="sm"
          onClick={() => onSelect(option.id)}
          className="justify-start text-left h-auto py-2 px-3 text-xs font-normal hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {option.icon && <span className="mr-2 flex-shrink-0">{option.icon}</span>}
          <span className="line-clamp-2">{option.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ChatOptions;
