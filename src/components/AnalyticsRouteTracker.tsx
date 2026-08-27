import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/utils/analytics";

export default function AnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      trackPageView(location.pathname);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return null;
}
