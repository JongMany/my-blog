import { useEffect, useMemo, useRef, useState } from "react";

type Scope = "page" | "prefix" | "site";
type Totals = { screenPageViews: number; totalUsers: number };
type GaPayload = { ok: boolean; totals?: Totals; error?: string };

type Options = {
  api: string; // Apps Script 웹앱 URL
  scope?: Scope; // 기본 'page'
  path?: string; // scope=page/prefix 일 때만 의미
  start?: string; // 기본 '30daysAgo'
  end?: string; // 기본 'today'
  cacheTtlSec?: number; // 세션 캐시 TTL (기본 60초)
  forceJsonp?: boolean; // 강제로 JSONP 사용 (다계정/쿠키 이슈 회피용)
};

type State = {
  loading: boolean;
  error: string | null;
  totals: Totals | null;
};

const SS_CACHE_KEY = "__ga_counters_cache__"; // sessionStorage 키

export function useGaCounters({
  api,
  scope = "page",
  path,
  start = "30daysAgo",
  end = "today",
  cacheTtlSec = 60,
  forceJsonp = false,
}: Options): State {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    totals: null,
  });

  // SSR 안전하게 현재 경로 결정
  const resolvedPath = useMemo(() => {
    if (scope === "site") return undefined;
    if (path) return path;
    if (typeof window !== "undefined") return window.location.pathname;
    return "/";
  }, [scope, path]);

  // 요청 URL (query string 포함)
  const url = useMemo(() => {
    if (!api) return null;
    const u = new URL(api);
    u.searchParams.set("scope", scope);
    if (resolvedPath) u.searchParams.set("path", resolvedPath);
    u.searchParams.set("start", start);
    u.searchParams.set("end", end);
    return u.toString();
  }, [api, scope, resolvedPath, start, end]);

  // 중복요청 방지용 플래그
  const inFlight = useRef(false);

  useEffect(() => {
    if (!url || !api) return;
    if (inFlight.current) return;
    inFlight.current = true;

    const cacheKey = `${url}`;
    const now = Date.now();

    // 1) 세션 캐시 히트 시 바로 반환
    if (typeof sessionStorage !== "undefined") {
      try {
        const raw = sessionStorage.getItem(SS_CACHE_KEY);
        if (raw) {
          const cache = JSON.parse(raw) as Record<
            string,
            { t: number; v: GaPayload }
          >;
          const hit = cache?.[cacheKey];
          if (hit && now - hit.t < cacheTtlSec * 1000 && hit.v?.ok) {
            setState({
              loading: false,
              error: null,
              totals: hit.v.totals ?? null,
            });
            inFlight.current = false;
            return;
          }
        }
      } catch {
        // 캐시 파싱 실패는 무시
      }
    }

    // 2) 네트워크 요청 (CORS 허용 시 fetch → 실패 시 JSONP 폴백)
    let cleaned = false;
    let abort = new AbortController();
    const endWith = (s: State) => {
      if (cleaned) return;
      setState(s);
      inFlight.current = false;
    };

    const saveCache = (payload: GaPayload) => {
      if (typeof sessionStorage === "undefined") return;
      try {
        const raw = sessionStorage.getItem(SS_CACHE_KEY);
        const obj = (raw ? JSON.parse(raw) : {}) as Record<
          string,
          { t: number; v: any }
        >;
        obj[cacheKey] = { t: now, v: payload };
        sessionStorage.setItem(SS_CACHE_KEY, JSON.stringify(obj));
      } catch {
        /* ignore */
      }
    };

    const doJsonp = () => {
      return new Promise<GaPayload>((resolve, reject) => {
        const cb = `__ga_jsonp_cb_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}`;
        (window as any)[cb] = (json: GaPayload) => {
          delete (window as any)[cb];
          script.remove();
          resolve(json);
        };
        const timer = window.setTimeout(() => {
          delete (window as any)[cb];
          script.remove();
          reject(new Error("JSONP timeout"));
        }, 15000);

        const script = document.createElement("script");
        script.src = url + (url.includes("?") ? "&" : "?") + "callback=" + cb;
        script.async = true;
        script.onerror = () => {
          window.clearTimeout(timer);
          delete (window as any)[cb];
          script.remove();
          reject(new Error("JSONP load error"));
        };
        script.onload = () => window.clearTimeout(timer);

        document.body.appendChild(script);
      });
    };

    const run = async () => {
      try {
        let json: GaPayload | null = null;

        if (!forceJsonp) {
          try {
            const res = await fetch(url!, {
              signal: abort.signal,
              credentials: "omit", // 익명 접근 시도 (쿠키 충돌 방지)
              cache: "no-store",
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            json = (await res.json()) as GaPayload;
          } catch {
            // fetch 실패 → JSONP 폴백
            json = await doJsonp();
          }
        } else {
          json = await doJsonp();
        }

        if (!json?.ok) {
          endWith({
            loading: false,
            error: json?.error || "GA 응답 오류",
            totals: null,
          });
          return;
        }

        saveCache(json);
        endWith({
          loading: false,
          error: null,
          totals: json.totals ?? null,
        });
      } catch (err: any) {
        endWith({
          loading: false,
          error: err?.message || "네트워크 오류",
          totals: null,
        });
      }
    };

    run();

    return () => {
      cleaned = true;
      abort.abort();
      inFlight.current = false;
    };
  }, [url, api, cacheTtlSec, forceJsonp]);

  return state;
}
