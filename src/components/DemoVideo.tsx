import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoVideoProps {
  src: string;
  poster: string;
  aspect: number;
  label: string;
  className?: string;
}

/**
 * Silent product demo that plays in a loop while on screen and pauses when it
 * scrolls away. Nothing is downloaded until it gets close to the viewport.
 * Visitors who prefer reduced motion see the poster with a play button.
 */
const DemoVideo = ({ src, poster, aspect, label, className }: DemoVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  const [manualPlay, setManualPlay] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        if (reduceMotion && !manualPlay) return;
        if (entry.intersectionRatio > 0.35) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: '200px 0px', threshold: [0, 0.35] }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion, manualPlay]);

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)} style={{ aspectRatio: String(aspect) }}>
      <video
        ref={ref}
        src={near ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {reduceMotion && !manualPlay && (
        <button
          type="button"
          onClick={() => {
            setManualPlay(true);
            ref.current?.play().catch(() => {});
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/10"
          aria-label={`Reproducir demostración: ${label}`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[hsl(var(--nova-ink))] shadow-xl">
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
};

export default DemoVideo;
