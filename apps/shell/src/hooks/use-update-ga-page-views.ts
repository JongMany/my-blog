import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useUpdateGaPageViews(
  measurementId?: string,
  isDevelopment?: boolean,
) {
  const loc = useLocation();
  useEffect(() => {
    if (isDevelopment) return;
    // gtag는 shell index.html에 있는 script 태그에 의해 정의되어 있습니다.
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
