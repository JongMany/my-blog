import { useEffect, useMemo, useState } from "react";

// ===== Constants =====

const CACHE_KEY = "__ga_counters_cache__";
const DEFAULT_CACHE_TTL = 60;
const DEFAULT_START_DATE = "30daysAgo";
const DEFAULT_END_DATE = "today";
const JSONP_TIMEOUT = 15000;

// ===== Types =====

type Scope = "page" | "prefix" | "site";

type GaTotals = {
  screenPageViews: number;
  totalUsers: number;
};

type GaPageRow = {
  path: string;
  views: number;
  users: number;
};

type GaApiResponse = {
  ok: boolean;
  totals?: GaTotals;
  rows?: GaPageRow[];
  error?: string;
};

type CacheEntry = {
  timestamp: number;
  value: GaApiResponse;
};

type UseGaCountersOptions = {
  api: string;
  scope?: Scope;
  path?: string;
  start?: string;
  end?: string;
  cacheTtlSec?: number;
  forceJsonp?: boolean;
  enabled?: boolean;
};

type UseGaCountersState = {
  loading: boolean;
  error: string | null;
  totals: GaTotals | null;
  rows: GaPageRow[];
};

// ===== Cache Utilities =====

function getCache(): Record<string, CacheEntry> {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const data = sessionStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setCache(key: string, value: GaApiResponse): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const cache = getCache();
    cache[key] = { timestamp: Date.now(), value };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache errors
  }
}

function getCached(key: string, ttl: number): GaApiResponse | null {
  const cache = getCache();
  const entry = cache[key];
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp >= ttl * 1000;
  if (isExpired || !entry.value?.ok) return null;

  return entry.value;
}

// ===== Network Request =====

function createJsonpRequest(url: string): Promise<GaApiResponse> {
  return new Promise((resolve, reject) => {
    const callback = `__ga_jsonp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    let isResolved = false;
    let timeoutId: number;

    const cleanup = () => {
      clearTimeout(timeoutId);
      if (script.parentNode) script.remove();
      if ((window as any)[callback]) delete (window as any)[callback];
    };

    const resolveOnce = (value: GaApiResponse) => {
      if (isResolved) return;
      isResolved = true;
      cleanup();
      resolve(value);
    };

    const rejectOnce = (error: Error) => {
      if (isResolved) return;
      isResolved = true;
      cleanup();
      reject(error);
    };

    timeoutId = window.setTimeout(
      () => rejectOnce(new Error("JSONP timeout")),
      JSONP_TIMEOUT,
    );

    (window as any)[callback] = (data: GaApiResponse) => resolveOnce(data);
    script.onerror = () => rejectOnce(new Error("JSONP load error"));
    script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${callback}`;
    script.async = true;
    document.body.appendChild(script);
  });
}

async function fetchData(
  url: string,
  signal: AbortSignal,
  forceJsonp: boolean,
): Promise<GaApiResponse> {
  if (forceJsonp) return createJsonpRequest(url);

  try {
    const response = await fetch(url, {
      signal,
      credentials: "omit",
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    return createJsonpRequest(url);
  }
}

function buildRequestUrl(
  apiUrl: string,
  scope: Scope,
  path: string | undefined,
  startDate: string,
  endDate: string,
): string | null {
  if (!apiUrl) return null;
  const url = new URL(apiUrl);
  url.searchParams.set("scope", scope);
  if (path) url.searchParams.set("path", path);
  url.searchParams.set("start", startDate);
  url.searchParams.set("end", endDate);
  return url.toString();
}

// ===== Main Hook =====

/**
 * Hook to fetch Google Analytics page view counters
 *
 * @example
 * const { totals } = useGaCounters({
 *   api: GA_API_URL,
 *   scope: "page",
 *   path: "/blog/post1"
 * });
 */
export function useGaCounters({
  api,
  scope = "page",
  path,
  start = DEFAULT_START_DATE,
  end = DEFAULT_END_DATE,
  cacheTtlSec = DEFAULT_CACHE_TTL,
  forceJsonp = false,
  enabled = true,
}: UseGaCountersOptions): UseGaCountersState {
  const [state, setState] = useState<UseGaCountersState>({
    loading: true,
    error: null,
    totals: null,
    rows: [],
  });

  const requestUrl = useMemo(() => {
    if (!api) return null;
    const resolvedPath =
      scope === "site"
        ? undefined
        : path ||
          (typeof window !== "undefined" ? window.location.pathname : "/");
    return buildRequestUrl(api, scope, resolvedPath, start, end);
  }, [api, scope, path, start, end]);

  useEffect(() => {
    if (!enabled || !requestUrl) {
      setState({ loading: false, error: null, totals: null, rows: [] });
      return;
    }

    let isCancelled = false;
    const abortController = new AbortController();

    (async () => {
      const cached = getCached(requestUrl, cacheTtlSec);
      if (cached) {
        if (!isCancelled) {
          setState({
            loading: false,
            error: null,
            totals: cached.totals ?? null,
            rows: cached.rows ?? [],
          });
        }
        return;
      }

      try {
        const response = await fetchData(
          requestUrl,
          abortController.signal,
          forceJsonp,
        );
        if (isCancelled) return;

        if (!response?.ok) {
          setState({
            loading: false,
            error: response?.error || "GA API response error",
            totals: null,
            rows: [],
          });
          return;
        }

        setCache(requestUrl, response);
        if (!isCancelled) {
          setState({
            loading: false,
            error: null,
            totals: response.totals ?? null,
            rows: response.rows ?? [],
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            loading: false,
            error: error instanceof Error ? error.message : "Network error",
            totals: null,
            rows: [],
          });
        }
      }
    })();

    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [requestUrl, cacheTtlSec, forceJsonp, enabled]);

  return state;
}

// ===== Batch Hook =====

type UseGaCountersBatchOptions = {
  api: string;
  paths: string[];
  scope?: Scope;
  start?: string;
  end?: string;
  cacheTtlSec?: number;
  forceJsonp?: boolean;
  enabled?: boolean;
};

type UseGaCountersBatchState = {
  loading: boolean;
  error: string | null;
  data: Record<string, GaTotals | null>;
};

/**
 * Hook to fetch multiple page counters in batch
 *
 * @example
 * const { loading, data } = useGaCountersBatch({
 *   api: GA_API_URL,
 *   paths: ['/blog/post1', '/blog/post2'],
 *   scope: 'page'
 * });
 */
export function useGaCountersBatch({
  api,
  paths,
  scope = "page",
  start = DEFAULT_START_DATE,
  end = DEFAULT_END_DATE,
  cacheTtlSec = DEFAULT_CACHE_TTL,
  forceJsonp = false,
  enabled = true,
}: UseGaCountersBatchOptions): UseGaCountersBatchState {
  const [state, setState] = useState<UseGaCountersBatchState>({
    loading: true,
    error: null,
    data: {},
  });

  useEffect(() => {
    if (!enabled || !api || paths.length === 0) {
      setState({ loading: false, error: null, data: {} });
      return;
    }

    let isCancelled = false;
    const abortControllers = paths.map(() => new AbortController());

    const fetchSinglePath = async (
      pagePath: string,
      signal: AbortSignal,
    ): Promise<GaTotals | null> => {
      const requestUrl = buildRequestUrl(api, scope, pagePath, start, end);
      if (!requestUrl) return null;

      const cached = getCached(requestUrl, cacheTtlSec);
      if (cached?.totals) return cached.totals;

      try {
        const response = await fetchData(requestUrl, signal, forceJsonp);
        if (response?.ok && response.totals) {
          setCache(requestUrl, response);
          return response.totals;
        }
      } catch {
        // Ignore errors
      }
      return null;
    };

    (async () => {
      setState((previousState) => ({
        ...previousState,
        loading: true,
        error: null,
      }));

      try {
        const results = await Promise.all(
          paths.map((pagePath, index) =>
            fetchSinglePath(pagePath, abortControllers[index].signal),
          ),
        );

        if (isCancelled) return;

        const pageData: Record<string, GaTotals | null> = {};
        paths.forEach((pagePath, index) => {
          pageData[pagePath] = results[index] ?? null;
        });

        setState({ loading: false, error: null, data: pageData });
      } catch (error) {
        if (!isCancelled) {
          setState({
            loading: false,
            error:
              error instanceof Error ? error.message : "Batch request failed",
            data: {},
          });
        }
      }
    })();

    return () => {
      isCancelled = true;
      abortControllers.forEach((controller) => controller.abort());
    };
  }, [
    api,
    paths.join(","),
    scope,
    start,
    end,
    cacheTtlSec,
    forceJsonp,
    enabled,
  ]);

  return state;
}

// ===== Convenience Hook =====

type UseAllSitePagesOptions = {
  api: string;
  start?: string;
  end?: string;
  cacheTtlSec?: number;
  forceJsonp?: boolean;
  enabled?: boolean;
};

/**
 * Convenience hook to fetch all site pages
 *
 * @example
 * const { loading, totals, rows } = useAllSitePages({
 *   api: GA_API_URL
 * });
 */
export function useAllSitePages({
  api,
  start = DEFAULT_START_DATE,
  end = DEFAULT_END_DATE,
  cacheTtlSec = DEFAULT_CACHE_TTL,
  forceJsonp = false,
  enabled = true,
}: UseAllSitePagesOptions): UseGaCountersState {
  return useGaCounters({
    api,
    scope: "site",
    start,
    end,
    cacheTtlSec,
    forceJsonp,
    enabled,
  });
}
