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

type FrameVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
  cancelVideoFrameCallback?: (id: number) => void;
};

/**
 * Silent product demo that plays in a loop while on screen and pauses when it
 * scrolls away. Nothing is downloaded until it gets close to the viewport.
 * Visitors who prefer reduced motion see the poster with a play button.
 *
 * Frames are copied onto a canvas: some Windows GPUs decode the video but never
 * paint the <video> layer, which left a blank box. A canvas always paints.
 */
const DemoVideo = ({ src, poster, aspect, label, className }: DemoVideoProps) => {
  const videoRef = useRef<FrameVideo>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [near, setNear] = useState(false);
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  const [manualPlay, setManualPlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
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

  // Copy each decoded frame onto the canvas while the video plays
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let handle = 0;
    let running = false;

    const draw = () => {
      if (!video.videoWidth) return;
      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    };
    const schedule = () => {
      if (!running) return;
      handle = video.requestVideoFrameCallback
        ? video.requestVideoFrameCallback(tick)
        : requestAnimationFrame(tick);
    };
    const tick = () => {
      draw();
      schedule();
    };
    const start = () => {
      if (running) return;
      running = true;
      schedule();
    };
    const stop = () => {
      running = false;
      if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };

    video.addEventListener('playing', start);
    video.addEventListener('pause', stop);
    video.addEventListener('loadeddata', draw);
    return () => {
      stop();
      video.removeEventListener('playing', start);
      video.removeEventListener('pause', stop);
      video.removeEventListener('loadeddata', draw);
    };
  }, []);

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)} style={{ aspectRatio: String(aspect) }}>
      <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={videoRef}
        src={near ? src : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas ref={canvasRef} role="img" aria-label={label} className="absolute inset-0 h-full w-full" />
      {reduceMotion && !manualPlay && (
        <button
          type="button"
          onClick={() => {
            setManualPlay(true);
            videoRef.current?.play().catch(() => {});
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
