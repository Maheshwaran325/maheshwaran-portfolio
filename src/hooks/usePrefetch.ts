import { useEffect } from 'react';

/**
 * Fetches a route's HTML when the pointer or keyboard focus reaches its link,
 * so the click lands on a warm cache.
 *
 * Every route is a static file emitted at build time, and the JS and CSS are
 * already loaded by the time anyone hovers, so the whole cost of a navigation
 * is one small HTML document. Starting it at the moment of intent — typically
 * a few hundred milliseconds before the click — is usually the whole latency.
 *
 * One delegated listener rather than handlers on each anchor: it covers links
 * rendered later without any component needing to know about it.
 *
 * `prefetch` is a hint the browser may ignore, and same-origin, so the site's
 * `default-src 'self'` policy already permits it.
 */

const EXCLUDED = /\.(pdf|png|jpe?g|webp|svg|ico|txt|xml|zip|woff2?)$/i;

/** Connections where speculative bytes are a cost, not a saving. */
function unwelcome(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (!c) return false;
  return Boolean(c.saveData) || /2g/.test(c.effectiveType ?? '');
}

export function usePrefetch(): void {
  useEffect(() => {
    if (!document.createElement('link').relList?.supports?.('prefetch')) return;
    if (unwelcome()) return;

    const done = new Set<string>([location.pathname]);

    const warm = (event: Event) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute('download') || anchor.target === '_blank') return;
      if (anchor.origin !== location.origin) return;
      if (EXCLUDED.test(anchor.pathname)) return;
      if (done.has(anchor.pathname)) return;

      done.add(anchor.pathname);

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'document';
      link.href = anchor.href;
      document.head.appendChild(link);
    };

    // `pointerover` bubbles where `pointerenter` does not, which is what makes
    // a single delegated listener possible.
    document.addEventListener('pointerover', warm, { passive: true });
    document.addEventListener('focusin', warm, { passive: true });
    return () => {
      document.removeEventListener('pointerover', warm);
      document.removeEventListener('focusin', warm);
    };
  }, []);
}
