import { motion, useReducedMotion } from 'framer-motion';
import metodoNovaIcon from '@/assets/metodo-nova-icon.webp';
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

// The Método NOVA emblem: spins in once, then floats gently
const NovaMethodIcon = ({ size = 112, onView = false, halo = true, className }: NovaMethodIconProps) => {
  const reduceMotion = useReducedMotion();

  const entrance = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.5, rotate: -180 },
        ...(onView
          ? { whileInView: { opacity: 1, scale: 1, rotate: 0 }, viewport: { once: true, amount: 0.6 } }
          : { animate: { opacity: 1, scale: 1, rotate: 0 } }),
        transition: { type: 'spring' as const, stiffness: 100, damping: 14, duration: 0.8 },
      };

  return (
    <motion.div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      {...entrance}
    >
      {halo && (
        <>
          <span className="absolute inset-[-18%] rounded-full bg-primary/20 blur-2xl" aria-hidden="true" />
          <span
            className="absolute inset-[-10%] rounded-full border border-dashed border-primary/30 motion-safe:animate-[spin_24s_linear_infinite]"
            aria-hidden="true"
          />
        </>
      )}
      <motion.img
        src={metodoNovaIcon}
        alt="Método NOVA"
        width={size}
        height={size}
        className="relative h-full w-full object-contain drop-shadow-[0_12px_24px_hsl(262_78%_40%/0.35)]"
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

export default NovaMethodIcon;
