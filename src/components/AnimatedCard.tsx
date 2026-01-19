import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedCard = ({ children, className, delay = 0 }: AnimatedCardProps) => {
  return (
    <Card 
      className={cn(
        "glass-card border-border/50 overflow-hidden animate-fade-in transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-border",
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard;
