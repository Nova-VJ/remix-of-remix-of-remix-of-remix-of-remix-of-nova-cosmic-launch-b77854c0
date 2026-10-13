import metodoNovaIcon from '@/assets/metodo-nova-icon.webp';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

interface NovaMethodIconProps {
  /** Icon size in px */
  size?: number;
  /** Spin in when it scrolls into view instead of on mount */
  onView?: boolean;
  /** Soft violet glow and orbit ring behind the icon */
  halo?: boolean;
  className?: string;
}

// The Método NOVA emblem: spins in once, then floats gently (pure CSS, no animation library)
const NovaMethodIcon = ({ size = 112, onView = false, halo = true, className }: NovaMethodIconProps) => {
  const { ref, isVisible } = useScrollReveal();
  const show = !onView || isVisible;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <div className={cn('relative h-full w-full', show ? 'motion-safe:animate-nova-spin-in' : 'opacity-0')}>
        {halo && (
          <>
            <span className="absolute inset-[-18%] rounded-full bg-primary/20 blur-2xl" aria-hidden="true" />
            <span
              className="absolute inset-[-10%] rounded-full border border-dashed border-primary/30 motion-safe:animate-[spin_24s_linear_infinite]"
              aria-hidden="true"
            />
          </>
        )}
        <img
          src={metodoNovaIcon}
          alt="Método NOVA"
          width={size}
          height={size}
          decoding="async"
          className="relative h-full w-full object-contain drop-shadow-[0_12px_24px_hsl(262_78%_40%/0.35)] motion-safe:animate-nova-bob"
        />
      </div>
    </div>
  );
};

export default NovaMethodIcon;
