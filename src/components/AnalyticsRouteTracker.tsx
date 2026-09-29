import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/utils/analytics";

/** Maximum wait for a lazy route to set its own document.title. */
const TITLE_WAIT_MS = 2000;

/**
 * Sends one page_view per route. On SPA navigation the lazy page sets its
 * title asynchronously, so we wait for the title to change (or a timeout)
 * instead of reading the previous page's title on the next tick.
 */
export default function AnalyticsRouteTracker() {
  const location = useLocation();
  const isFirstRouteRef = useRef(true);
  const trackedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const pathname = location.pathname;
    // StrictMode re-runs effects for the same navigation; count it once.
    if (trackedKeyRef.current === location.key) return;
    let sent = false;
    const send = (title?: string) => {
      if (sent) return;
      sent = true;
      trackedKeyRef.current = location.key;
      trackPageView(pathname, title);
    };

    // The server-rendered HTML already carries the correct title on first load.
    if (isFirstRouteRef.current) {
      isFirstRouteRef.current = false;
      send();
      return;
    }

    const previousTitle = document.title;
    const observer = new MutationObserver(() => {
      if (document.title !== previousTitle) send();
    });
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    const timer = window.setTimeout(() => send(), TITLE_WAIT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      // Leaving before the title settled: record the path without a stale title.
      if (!sent) send("");
    };
  }, [location.pathname, location.key]);

  return null;
}
