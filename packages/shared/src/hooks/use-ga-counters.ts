import { useEffect, useMemo, useRef, useState } from "react";

// ===== Types =====

type Scope = "page" | "prefix" | "site";

type Totals = {
  screenPageViews: number;
  totalUsers: number;
};

type PageRow = {
  path: string;
  views: number;
  users: number;
};

type GaPayload = {
  ok: boolean;
  totals?: Totals;
  rows?: PageRow[];
  error?: string;
};

type Options = {
  api: string; // Apps Script 웹앱 URL
  scope?: Scope; // 기본 'page'
  path?: string; // scope=page/prefix 일 때만 의미
  start?: string; // 기본 '30daysAgo'
  end?: string; // 기본 'today'
  cacheTtlSec?: number; // 세션 캐시 TTL (기본 60초)
  forceJsonp?: boolean; // 강제로 JSONP 사용
};

type State = {
  loading: boolean;
  error: string | null;
  totals: Totals | null;
  rows: PageRow[]; // 페이지별 데이터 (prefix scope일 때 유용)
};

const SS_CACHE_KEY = "__ga_counters_cache__";

// ===== Main Hook =====

/**
 * Google Analytics 페이지 조회수를 가져오는 훅
 *
 * @example
 * // 단일 페이지 조회수
 * const { totals } = useGaCounters({
 *   api: GA_API_URL,
 *   scope: "page",
 *   path: "/blog/post1"
 * });
 *
 * @example
 * // prefix로 시작하는 모든 페이지 조회수
 * const { totals, rows } = useGaCounters({
 *   api: GA_API_URL,
 *   scope: "prefix",
 *   path: "/blog/"
 * });
 * // rows에는 각 페이지별 데이터가 들어있음
 *
 * @example
 * // 전체 사이트의 모든 페이지 리스트 (Apps Script 수정 필요)
 * const { totals, rows } = useGaCounters({
 *   api: GA_API_URL,
 *   scope: "site"
 * });
 * // rows에는 모든 페이지별 데이터가 들어있음
 */
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
    rows: [],
  });

  // SSR 안전하게 현재 경로 결정
  const resolvedPath = useMemo(() => {
    if (scope === "site") return undefined;
    if (path) return path;
    if (typeof window !== "undefined") return window.location.pathname;
    return "/";
  }, [scope, path]);

  // 요청 URL 생성
  const url = useMemo(() => {
    if (!api) return null;
    const u = new URL(api);
    u.searchParams.set("scope", scope);
    if (resolvedPath) u.searchParams.set("path", resolvedPath);
    u.searchParams.set("start", start);
    u.searchParams.set("end", end);
    return u.toString();
  }, [api, scope, resolvedPath, start, end]);

  const inFlight = useRef(false);

  useEffect(() => {
    if (!url || !api) {
      setState({ loading: false, error: null, totals: null, rows: [] });
      return;
    }

    if (inFlight.current) return;
    inFlight.current = true;

    const cacheKey = url;
    const now = Date.now();

    // 세션 캐시 확인
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
              rows: hit.v.rows ?? [],
            });
            inFlight.current = false;
            return;
          }
        }
      } catch {
        // 캐시 파싱 실패는 무시
      }
    }

    // 네트워크 요청
    let cleaned = false;
    const abort = new AbortController();

    const saveCache = (payload: GaPayload) => {
      if (typeof sessionStorage === "undefined") return;
      try {
        const raw = sessionStorage.getItem(SS_CACHE_KEY);
        const obj = (raw ? JSON.parse(raw) : {}) as Record<
          string,
          { t: number; v: GaPayload }
        >;
        obj[cacheKey] = { t: now, v: payload };
        sessionStorage.setItem(SS_CACHE_KEY, JSON.stringify(obj));
      } catch {
        /* ignore */
      }
    };

    const doJsonp = (): Promise<GaPayload> => {
      return new Promise((resolve, reject) => {
        const cb = `__ga_jsonp_cb_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}`;

        let resolved = false;

        const cleanup = () => {
          if (script.parentNode) {
            script.remove();
          }
          if ((window as any)[cb]) {
            delete (window as any)[cb];
          }
        };

        (window as any)[cb] = (json: GaPayload) => {
          if (resolved) return;
          resolved = true;
          window.clearTimeout(timer);
          cleanup();
          resolve(json);
        };

        const timer = window.setTimeout(() => {
          if (resolved) return;
          resolved = true;
          cleanup();
          reject(new Error("JSONP timeout"));
        }, 15000);

        const script = document.createElement("script");
        script.src = url + (url.includes("?") ? "&" : "?") + "callback=" + cb;
        script.async = true;

        script.onerror = () => {
          if (resolved) return;
          resolved = true;
          window.clearTimeout(timer);
          cleanup();
          reject(new Error("JSONP load error"));
        };

        script.onload = () => window.clearTimeout(timer);

        document.body.appendChild(script);
      });
    };

    const fetchData = async (): Promise<GaPayload> => {
      if (forceJsonp) {
        return await doJsonp();
      }

      try {
        const res = await fetch(url, {
          signal: abort.signal,
          credentials: "omit",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return (await res.json()) as GaPayload;
      } catch (fetchErr) {
        // fetch 실패 시 JSONP 폴백
        return await doJsonp();
      }
    };

    const run = async () => {
      try {
        const json = await fetchData();

        if (cleaned) return;

        if (!json?.ok) {
          setState({
            loading: false,
            error: json?.error || "GA 응답 오류",
            totals: null,
            rows: [],
          });
          return;
        }

        saveCache(json);

        setState({
          loading: false,
          error: null,
          totals: json.totals ?? null,
          rows: json.rows ?? [],
        });
      } catch (err: any) {
        if (cleaned) return;
        setState({
          loading: false,
          error: err?.message || "네트워크 오류",
          totals: null,
          rows: [],
        });
      } finally {
        inFlight.current = false;
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

// ===== 배치 요청을 위한 훅 =====

type BatchOptions = {
  api: string;
  paths: string[]; // 여러 경로 배열
  scope?: Scope;
  start?: string;
  end?: string;
  cacheTtlSec?: number;
  forceJsonp?: boolean;
};

type BatchState = {
  loading: boolean;
  error: string | null;
  data: Record<string, Totals | null>; // path -> totals 매핑
};

/**
 * 여러 페이지의 조회수를 한 번에 가져오는 훅
 * 각 경로마다 개별 요청을 보냅니다.
 *
 * @example
 * const { loading, data } = useGaCountersBatch({
 *   api: GA_API_URL,
 *   paths: ['/blog/post1', '/blog/post2', '/blog/post3'],
 *   scope: 'page'
 * });
 * // data['/blog/post1'] => { screenPageViews: 100, totalUsers: 50 }
 */
export function useGaCountersBatch({
  api,
  paths,
  scope = "page",
  start = "30daysAgo",
  end = "today",
  cacheTtlSec = 60,
  forceJsonp = false,
}: BatchOptions): BatchState {
  const [state, setState] = useState<BatchState>({
    loading: true,
    error: null,
    data: {},
  });

  useEffect(() => {
    if (!api || paths.length === 0) {
      setState({ loading: false, error: null, data: {} });
      return;
    }

    let cleaned = false;
    const abortControllers = paths.map(() => new AbortController());

    const fetchPath = async (
      path: string,
      signal: AbortSignal,
    ): Promise<Totals | null> => {
      const u = new URL(api);
      u.searchParams.set("scope", scope);
      u.searchParams.set("path", path);
      u.searchParams.set("start", start);
      u.searchParams.set("end", end);

      const url = u.toString();
      const cacheKey = url;
      const now = Date.now();

      // 캐시 확인
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
              return hit.v.totals ?? null;
            }
          }
        } catch {
          // 캐시 파싱 실패는 무시
        }
      }

      // 네트워크 요청
      try {
        const doJsonp = (): Promise<GaPayload> => {
          return new Promise((resolve, reject) => {
            const cb = `__ga_jsonp_cb_${Date.now()}_${Math.random()
              .toString(36)
              .slice(2)}`;

            let resolved = false;

            const cleanup = () => {
              if (script.parentNode) {
                script.remove();
              }
              if ((window as any)[cb]) {
                delete (window as any)[cb];
              }
            };

            (window as any)[cb] = (json: GaPayload) => {
              if (resolved) return;
              resolved = true;
              window.clearTimeout(timer);
              cleanup();
              resolve(json);
            };

            const timer = window.setTimeout(() => {
              if (resolved) return;
              resolved = true;
              cleanup();
              reject(new Error("JSONP timeout"));
            }, 15000);

            const script = document.createElement("script");
            script.src =
              url + (url.includes("?") ? "&" : "?") + "callback=" + cb;
            script.async = true;

            script.onerror = () => {
              if (resolved) return;
              resolved = true;
              window.clearTimeout(timer);
              cleanup();
              reject(new Error("JSONP load error"));
            };

            script.onload = () => window.clearTimeout(timer);

            document.body.appendChild(script);
          });
        };

        let json: GaPayload;

        if (forceJsonp) {
          json = await doJsonp();
        } else {
          try {
            const res = await fetch(url, {
              signal,
              credentials: "omit",
              cache: "no-store",
            });

            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }

            json = (await res.json()) as GaPayload;
          } catch {
            // fetch 실패 시 JSONP 폴백
            json = await doJsonp();
          }
        }

        if (json?.ok && json.totals) {
          // 캐시 저장
          if (typeof sessionStorage !== "undefined") {
            try {
              const raw = sessionStorage.getItem(SS_CACHE_KEY);
              const obj = (raw ? JSON.parse(raw) : {}) as Record<
                string,
                { t: number; v: GaPayload }
              >;
              obj[cacheKey] = { t: now, v: json };
              sessionStorage.setItem(SS_CACHE_KEY, JSON.stringify(obj));
            } catch {
              /* ignore */
            }
          }
          return json.totals;
        }

        return null;
      } catch {
        return null;
      }
    };

    const run = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const results = await Promise.all(
          paths.map((path, idx) =>
            fetchPath(path, abortControllers[idx].signal),
          ),
        );

        if (cleaned) return;

        const data: Record<string, Totals | null> = {};
        paths.forEach((path, idx) => {
          data[path] = results[idx] ?? null;
        });

        setState({
          loading: false,
          error: null,
          data,
        });
      } catch (err: any) {
        if (cleaned) return;
        setState({
          loading: false,
          error: err?.message || "배치 요청 실패",
          data: {},
        });
      }
    };

    run();

    return () => {
      cleaned = true;
      abortControllers.forEach((ac) => ac.abort());
    };
  }, [api, paths.join(","), scope, start, end, cacheTtlSec, forceJsonp]);

  return state;
}

// ===== 편의 훅: 전체 사이트 페이지 리스트 =====

type UseAllSitePagesOptions = {
  api: string;
  start?: string;
  end?: string;
  cacheTtlSec?: number;
  forceJsonp?: boolean;
};

/**
 * 전체 사이트의 모든 페이지 리스트를 가져오는 편의 훅
 * scope: "site"를 기본값으로 사용합니다.
 *
 * @example
 * const { loading, totals, rows } = useAllSitePages({
 *   api: GA_API_URL,
 *   start: "30daysAgo",
 *   end: "today"
 * });
 */
export function useAllSitePages({
  api,
  start = "30daysAgo",
  end = "today",
  cacheTtlSec = 60,
  forceJsonp = false,
}: UseAllSitePagesOptions): State {
  return useGaCounters({
    api,
    scope: "site",
    start,
    end,
    cacheTtlSec,
    forceJsonp,
  });
}
