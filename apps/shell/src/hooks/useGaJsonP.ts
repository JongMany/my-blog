import { useEffect, useState } from "react";

type GaResult = {
  ok: boolean;
  totals: { screenPageViews: number; totalUsers: number };
  rows: { path: string; views: number; users: number }[];
};

export function useGaJsonp(
  scope: "site" | "page" | "prefix",
  path?: string,
  { start = "30daysAgo", end = "today" }: { start?: string; end?: string } = {},
) {
  const [data, setData] = useState<GaResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    jsonp<GaResult>(
      import.meta.env.VITE_GA_API_URL ??
        "https://script.google.com/macros/s/AKfycbyGtQznICkAvDQLIOh8nsKDRV1Ve9BNZGOfxndr1KzJWneeBNixQNb3L8f4ikPrbX6X/exec",
      {
        scope,
        ...(path ? { path } : {}),
        start,
        end,
      },
    )
      .then((res) => {
        if (cancelled) return;
        if (!res || res.ok === false) {
          // throw new Error(res?.error || "GA JSONP returned ok=false");
        }
        setData(res);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      });

    return () => {
      cancelled = true;
    };
  }, [scope, path, start, end]);

  return { data, error };
}

// jsonp.ts
export function jsonp<T = any>(
  url: string,
  params: Record<string, string> = {},
  { callbackParam = "callback", timeoutMs = 10000 } = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    const cbName = `__ga_jsonp_cb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    (window as any)[cbName] = (payload: any) => {
      cleanup();
      try {
        // 서버가 string을 주면 JSON.parse 시도
        resolve(typeof payload === "string" ? JSON.parse(payload) : payload);
      } catch (e) {
        reject(e);
      }
    };
    const usp = new URLSearchParams(params);
    usp.set(callbackParam, cbName);
    usp.set("t", String(Date.now())); // cache-busting

    const script = document.createElement("script");
    script.src = `${url}?${usp.toString()}`;
    script.async = true;

    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("JSONP timeout"));
    }, timeoutMs);

    function cleanup() {
      window.clearTimeout(timer);
      try {
        delete (window as any)[cbName];
      } catch {}
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    script.onerror = () => {
      cleanup();
      reject(new Error("JSONP load error"));
    };

    // onload가 불려도 콜백이 호출 안 되면 타임아웃으로 처리됨
    console.log(url, "sc", script.src);
    document.head.appendChild(script);
  });
}
