import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useGaPageViews(
  measurementId?: string,
  isDevelopment?: boolean,
) {
  const loc = useLocation();
  useEffect(() => {
    // if (isDevelopment) return;
    const gtag = window.gtag;
    if (!gtag || !measurementId) return;

    gtag("event", "page_view", {
      page_path: loc.pathname + loc.search + loc.hash,
      page_title: document.title,
      page_location: window.location.href,
      // send_to: measurementId,
      // 필요시: send_to: measurementId,
    });
  }, [loc.pathname, loc.search, loc.hash, measurementId, isDevelopment]);
}
