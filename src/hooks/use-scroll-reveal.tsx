import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const { triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  // Respect "reduce motion" by showing content straight away
  const [isVisible, setIsVisible] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  // Reveal as soon as the section edge enters the viewport. A percentage threshold
  // left tall sections blank on phones until a large part of them was on screen.
  const threshold = 0;
  const rootMargin = options.rootMargin ?? '0px 0px -60px 0px';

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
