import metodoNovaIcon from '@/assets/metodo-nova-icon.webp';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

interface NovaMethodIconProps {
  /** Icon size in px */
  size?: number;
  /** Spin in when it scrolls into view instead of on mount */
  onView?: boolean;
  className?: string;
}

// The Método NOVA emblem: spins in once, then floats gently (pure CSS, no animation library)
const NovaMethodIcon = ({ size = 112, onView = false, className }: NovaMethodIconProps) => {
  const { ref, isVisible } = useScrollReveal();
  const show = !onView || isVisible;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Outer layer spins in once, the image itself keeps floating */}
      <div className={cn('h-full w-full', show ? 'motion-safe:animate-nova-spin-in' : 'opacity-0')}>
        <img
          src={metodoNovaIcon}
          alt="Método NOVA"
          width={size}
          height={size}
          decoding="async"
          className="h-full w-full object-contain drop-shadow-[0_12px_20px_hsl(262_78%_40%/0.3)] motion-safe:animate-nova-bob"
        />
      </div>
    </div>
  );
};

export default NovaMethodIcon;
