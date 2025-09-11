import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useGaPageViews(measurementId: string) {
  const loc = useLocation();
  useEffect(() => {
    const gtag = (window as any).gtag as ((...args: any[]) => void) | undefined;
    console.log(measurementId, gtag);
    if (!gtag || !measurementId) return;

    console.log(loc.pathname + loc.search + loc.hash);
    gtag("event", "page_view", {
      page_path: loc.pathname + loc.search + loc.hash,
      page_title: document.title,
      page_location: window.location.href,
      // 필요시: send_to: measurementId,
    });
  }, [loc.pathname, loc.search, loc.hash, measurementId]);
}
