import { useEffect, useMemo, useRef, useState } from "react";

const CACHE_KEY = "__ga_counters_cache__";
const DEFAULT_CACHE_TTL = 60;
const DEFAULT_START_DATE = "30daysAgo";
const DEFAULT_END_DATE = "today";
const JSONP_TIMEOUT = 15000;

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

// ===== Cache Manager =====

interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface CacheEntry<T> {
  timestamp: number;
  value: T;
}

interface CacheManagerOptions<T> {
  storage?: StorageAdapter;
  key?: string;
  validator?: (value: T) => boolean;
}

class CacheManager<T = unknown> {
  private readonly storage: StorageAdapter | null;
  private readonly cacheKey: string;
  private readonly validator?: (value: T) => boolean;

  constructor(options: CacheManagerOptions<T> = {}) {
    this.cacheKey = options.key ?? CACHE_KEY;
    this.validator = options.validator;
    this.storage =
      options.storage ??
      (typeof sessionStorage !== "undefined" ? sessionStorage : null);
  }

  private getStore(): Record<string, CacheEntry<T>> {
    if (!this.storage) return {};
    try {
      const data = this.storage.getItem(this.cacheKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  set(key: string, value: T): void {
    if (!this.storage) return;
    try {
      const store = this.getStore();
      store[key] = { timestamp: Date.now(), value };
      this.storage.setItem(this.cacheKey, JSON.stringify(store));
    } catch {
      // Ignore errors
    }
  }

  get(key: string, ttlSeconds?: number): T | null {
    const store = this.getStore();
    const entry = store[key];
    if (!entry) return null;

    if (ttlSeconds !== undefined) {
      if (Date.now() - entry.timestamp >= ttlSeconds * 1000) return null;
    }

    if (this.validator && !this.validator(entry.value)) return null;

    return entry.value;
  }
}

// ===== Request Controller =====

class RequestController {
  private controllers: AbortController[] = [];
  private cancelled = false;

  getSignal(): AbortSignal {
    if (this.cancelled) {
      const c = new AbortController();
      c.abort();
      return c.signal;
    }
    const controller = new AbortController();
    this.controllers.push(controller);
    return controller.signal;
  }

  getSignals(count: number): AbortSignal[] {
    return Array.from({ length: count }, () => this.getSignal());
  }

  isCancelled(): boolean {
    return this.cancelled;
  }

  cancel(): void {
    if (this.cancelled) return;
    this.cancelled = true;
    this.controllers.forEach((c) => c.abort());
    this.controllers = [];
  }

  reset(): void {
    this.cancel();
    this.cancelled = false;
  }
}

// ===== Network =====

function jsonp(url: string): Promise<GaApiResponse> {
  return new Promise((resolve, reject) => {
    const cb = `__ga_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    let done = false;
    let timeout: number;

    const finish = (fn: () => void) => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      script.remove();
      delete (window as any)[cb];
      fn();
    };

    timeout = setTimeout(
      () => finish(() => reject(new Error("Timeout"))),
      JSONP_TIMEOUT,
    );

    (window as any)[cb] = (data: GaApiResponse) => finish(() => resolve(data));
    script.onerror = () => finish(() => reject(new Error("Load error")));
    script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${cb}`;
    script.async = true;
    document.body.appendChild(script);
  });
}

async function fetchData(
  url: string,
  signal: AbortSignal,
  forceJsonp: boolean,
): Promise<GaApiResponse> {
  if (forceJsonp) return jsonp(url);
  try {
    const res = await fetch(url, {
      signal,
      credentials: "omit",
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return jsonp(url);
  }
}

function buildUrl(
  api: string,
  scope: Scope,
  path: string | undefined,
  start: string,
  end: string,
): string | null {
  if (!api) return null;
  const url = new URL(api);
  url.searchParams.set("scope", scope);
  if (path) url.searchParams.set("path", path);
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);
  return url.toString();
}

// ===== Main Hook =====

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

  const cacheRef = useRef(
    new CacheManager<GaApiResponse>({ validator: (v) => v.ok === true }),
  );
  const controllerRef = useRef(new RequestController());

  const url = useMemo(() => {
    if (!api) return null;
    const resolvedPath =
      scope === "site"
        ? undefined
        : path ||
          (typeof window !== "undefined" ? window.location.pathname : "/");
    return buildUrl(api, scope, resolvedPath, start, end);
  }, [api, scope, path, start, end]);

  useEffect(() => {
    if (!enabled || !url) {
      setState({ loading: false, error: null, totals: null, rows: [] });
      return;
    }

    const controller = controllerRef.current;
    const cache = cacheRef.current;
    controller.reset();

    // Always set loading to true when starting a new request
    setState({ loading: true, error: null, totals: null, rows: [] });

    (async () => {
      const signal = controller.getSignal();
      const cached = cache.get(url, cacheTtlSec);

      if (cached) {
        if (!controller.isCancelled()) {
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
        const response = await fetchData(url, signal, forceJsonp);
        if (controller.isCancelled()) return;

        if (!response?.ok) {
          setState({
            loading: false,
            error: response?.error || "API error",
            totals: null,
            rows: [],
          });
          return;
        }

        cache.set(url, response);
        if (!controller.isCancelled()) {
          setState({
            loading: false,
            error: null,
            totals: response.totals ?? null,
            rows: response.rows ?? [],
          });
        }
      } catch (error) {
        if (!controller.isCancelled()) {
          setState({
            loading: false,
            error: error instanceof Error ? error.message : "Network error",
            totals: null,
            rows: [],
          });
        }
      }
    })();

    return () => controller.cancel();
  }, [url, cacheTtlSec, forceJsonp, enabled]);

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

  const cacheRef = useRef(
    new CacheManager<GaApiResponse>({ validator: (v) => v.ok === true }),
  );
  const controllerRef = useRef(new RequestController());

  useEffect(() => {
    if (!enabled || !api || !paths.length) {
      setState({ loading: false, error: null, data: {} });
      return;
    }

    const controller = controllerRef.current;
    const cache = cacheRef.current;
    controller.reset();
    const signals = controller.getSignals(paths.length);

    (async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const results = await Promise.all(
          paths.map(async (pagePath, i) => {
            const url = buildUrl(api, scope, pagePath, start, end);
            if (!url) return null;

            const cached = cache.get(url, cacheTtlSec);
            if (cached?.totals) return cached.totals;

            try {
              const response = await fetchData(url, signals[i], forceJsonp);
              if (response?.ok && response.totals) {
                cache.set(url, response);
                return response.totals;
              }
            } catch {
              // Ignore errors
            }
            return null;
          }),
        );

        if (controller.isCancelled()) return;

        const data: Record<string, GaTotals | null> = {};
        paths.forEach((path, i) => {
          data[path] = results[i] ?? null;
        });

        setState({ loading: false, error: null, data });
      } catch (error) {
        if (!controller.isCancelled()) {
          setState({
            loading: false,
            error: error instanceof Error ? error.message : "Batch failed",
            data: {},
          });
        }
      }
    })();

    return () => controller.cancel();
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
