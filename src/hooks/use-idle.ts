import { useEffect, useState } from 'react';

/**
 * True once the page has loaded and the browser is idle, so non-essential
 * widgets (chat, popups) don't compete with the first paint.
 */
export const useIdle = (timeout = 2500) => {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timerId: number | undefined;
    const done = () => setIdle(true);
    const start = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(done, { timeout });
      } else {
        timerId = setTimeout(done, 1200) as unknown as number;
      }
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      window.removeEventListener('load', start);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, [timeout]);

  return idle;
};
