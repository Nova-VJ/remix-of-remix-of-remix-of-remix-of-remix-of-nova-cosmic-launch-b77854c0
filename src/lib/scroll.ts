/**
 * Smooth-scrolls to a section by id, then corrects the landing spot once the
 * scroll ends: sections further down use content-visibility, so their real
 * height is only known as they render on the way.
 */
export function scrollToSectionId(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';
  el.scrollIntoView({ behavior, block: 'start' });

  const correct = () => {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    if (Math.abs(el.getBoundingClientRect().top - padding) > 4) {
      el.scrollIntoView({ behavior, block: 'start' });
    }
  };

  if ('onscrollend' in window) {
    window.addEventListener('scrollend', correct, { once: true });
  } else {
    setTimeout(correct, 900);
  }
  return true;
}
