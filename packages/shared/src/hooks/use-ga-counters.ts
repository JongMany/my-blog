import { useEffect, useMemo, useRef, useState } from "react";

// ===== 상수 정의 =====

const ANALYTICS_CACHE_KEY = "__google_analytics_cache__";
const DEFAULT_CACHE_TTL_SECONDS = 60;
const DEFAULT_DATE_RANGE_START = "30daysAgo";
const DEFAULT_DATE_RANGE_END = "today";
const JSONP_REQUEST_TIMEOUT_MS = 15000;

// ===== 타입 정의 =====

/**
 * Google Analytics 데이터 조회 범위
 * - page: 특정 페이지의 통계
 * - prefix: 특정 경로로 시작하는 모든 페이지 통계
 * - site: 전체 사이트 통계
 */
type AnalyticsScope = "page" | "prefix" | "site";

/**
 * Google Analytics 전체 통계 데이터
 */
type AnalyticsTotals = {
  screenPageViews: number;
  totalUsers: number;
};

/**
 * Google Analytics 페이지별 통계 데이터
 */
type AnalyticsPageData = {
  path: string;
  views: number;
  users: number;
};

/**
 * Google Analytics API 응답 데이터
 */
type AnalyticsApiResponse = {
  ok: boolean;
  totals?: AnalyticsTotals;
  rows?: AnalyticsPageData[];
  error?: string;
};

/**
 * Google Analytics 통계 조회 훅 옵션
 */
type UseGoogleAnalyticsStatsOptions = {
  /** Google Analytics API 엔드포인트 URL */
  apiUrl: string;
  /** 데이터 조회 범위 */
  scope?: AnalyticsScope;
  /** 조회할 페이지 경로 (scope가 'page' 또는 'prefix'일 때 사용) */
  pagePath?: string;
  /** 조회 시작 날짜 (예: "30daysAgo", "2024-01-01") */
  startDate?: string;
  /** 조회 종료 날짜 (예: "today", "2024-12-31") */
  endDate?: string;
  /** 캐시 유효 시간 (초) */
  cacheTtlSeconds?: number;
  /** JSONP 요청 강제 사용 여부 */
  shouldForceJsonp?: boolean;
  /** 훅 활성화 여부 */
  enabled?: boolean;
};

/**
 * Google Analytics 통계 조회 훅 반환값
 */
type UseGoogleAnalyticsStatsResult = {
  /** 데이터 로딩 중 여부 */
  loading: boolean;
  /** 에러 메시지 (에러 발생 시) */
  error: string | null;
  /** 전체 통계 데이터 */
  totals: AnalyticsTotals | null;
  /** 페이지별 통계 데이터 배열 */
  pageDataList: AnalyticsPageData[];
};

// ===== 캐시 관리자 =====

interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface CacheEntry<T> {
  timestamp: number;
  value: T;
}

interface AnalyticsCacheManagerOptions<T> {
  storage?: StorageAdapter;
  cacheKey?: string;
  validator?: (value: T) => boolean;
}

/**
 * 세션 스토리지를 사용한 캐시 관리자
 * Google Analytics API 응답을 캐싱하여 불필요한 요청을 방지합니다.
 */
class AnalyticsCacheManager<T = unknown> {
  private readonly storage: StorageAdapter | null;
  private readonly cacheKey: string;
  private readonly validator?: (value: T) => boolean;

  constructor(options: AnalyticsCacheManagerOptions<T> = {}) {
    this.cacheKey = options.cacheKey ?? ANALYTICS_CACHE_KEY;
    this.validator = options.validator;
    this.storage =
      options.storage ??
      (typeof sessionStorage !== "undefined" ? sessionStorage : null);
  }

  private getCacheStore(): Record<string, CacheEntry<T>> {
    if (!this.storage) return {};
    try {
      const data = this.storage.getItem(this.cacheKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * 캐시에 데이터 저장
   */
  set(key: string, value: T): void {
    if (!this.storage) return;
    try {
      const store = this.getCacheStore();
      store[key] = { timestamp: Date.now(), value };
      this.storage.setItem(this.cacheKey, JSON.stringify(store));
    } catch {
      // 스토리지 오류는 무시 (용량 초과 등)
    }
  }

  /**
   * 캐시에서 데이터 조회
   * @param key 캐시 키
   * @param ttlSeconds 캐시 유효 시간 (초). 지정하지 않으면 만료되지 않음
   * @returns 캐시된 데이터 또는 null
   */
  get(key: string, ttlSeconds?: number): T | null {
    const store = this.getCacheStore();
    const entry = store[key];
    if (!entry) return null;

    // TTL 체크
    if (ttlSeconds !== undefined) {
      const isExpired = Date.now() - entry.timestamp >= ttlSeconds * 1000;
      if (isExpired) return null;
    }

    // 유효성 검사
    if (this.validator && !this.validator(entry.value)) return null;

    return entry.value;
  }
}

// ===== 요청 취소 컨트롤러 =====

/**
 * 비동기 요청의 취소를 관리하는 컨트롤러
 * 컴포넌트 언마운트나 의존성 변경 시 진행 중인 요청을 취소합니다.
 */
class RequestCancellationController {
  private abortControllers: AbortController[] = [];
  private isCancelled = false;

  /**
   * 새로운 AbortSignal 생성 및 등록
   */
  createAbortSignal(): AbortSignal {
    if (this.isCancelled) {
      const controller = new AbortController();
      controller.abort();
      return controller.signal;
    }
    const controller = new AbortController();
    this.abortControllers.push(controller);
    return controller.signal;
  }

  /**
   * 취소 상태 확인
   */
  hasBeenCancelled(): boolean {
    return this.isCancelled;
  }

  /**
   * 모든 진행 중인 요청 취소
   */
  cancelAllRequests(): void {
    if (this.isCancelled) return;
    this.isCancelled = true;
    this.abortControllers.forEach((controller) => controller.abort());
    this.abortControllers = [];
  }

  /**
   * 취소 상태 초기화 (새로운 요청 시작 전 호출)
   */
  reset(): void {
    this.cancelAllRequests();
    this.isCancelled = false;
  }
}

// ===== 네트워크 요청 =====

/**
 * JSONP 콜백 함수 타입
 */
type JsonpCallback = (data: AnalyticsApiResponse) => void;

/**
 * window 객체에 JSONP 콜백을 안전하게 설정/제거하는 헬퍼
 */
function setJsonpCallback(callbackName: string, callback: JsonpCallback): void {
  const windowWithCallback = window as unknown as Record<
    string,
    JsonpCallback | undefined
  >;
  windowWithCallback[callbackName] = callback;
}

function removeJsonpCallback(callbackName: string): void {
  const windowWithCallback = window as unknown as Record<
    string,
    JsonpCallback | undefined
  >;
  if (callbackName in windowWithCallback) {
    delete windowWithCallback[callbackName];
  }
}

/**
 * JSONP를 사용하여 Google Analytics API 데이터 조회
 * CORS 제한을 우회하기 위해 사용됩니다.
 */
function fetchAnalyticsDataViaJsonp(
  apiUrl: string,
): Promise<AnalyticsApiResponse> {
  return new Promise((resolve, reject) => {
    const callbackName = `__analytics_jsonp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
    const scriptElement = document.createElement("script");
    let isResolved = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      clearTimeout(timeoutId);
      if (scriptElement.parentNode) {
        scriptElement.remove();
      }
      removeJsonpCallback(callbackName);
    };

    const resolveOnce = (value: AnalyticsApiResponse) => {
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

    timeoutId = setTimeout(
      () => rejectOnce(new Error("JSONP 요청 시간 초과")),
      JSONP_REQUEST_TIMEOUT_MS,
    );

    const callback: JsonpCallback = (data: AnalyticsApiResponse) =>
      resolveOnce(data);
    setJsonpCallback(callbackName, callback);

    scriptElement.onerror = () =>
      rejectOnce(new Error("JSONP 스크립트 로드 실패"));
    scriptElement.async = true;

    const querySeparator = apiUrl.includes("?") ? "&" : "?";
    scriptElement.src = `${apiUrl}${querySeparator}callback=${callbackName}`;
    document.body.appendChild(scriptElement);
  });
}

/**
 * Google Analytics API 데이터 조회
 * fetch를 시도하고 실패 시 JSONP로 폴백합니다.
 */
async function fetchAnalyticsData(
  apiUrl: string,
  abortSignal: AbortSignal,
  shouldForceJsonp: boolean,
): Promise<AnalyticsApiResponse> {
  if (shouldForceJsonp) {
    return fetchAnalyticsDataViaJsonp(apiUrl);
  }

  try {
    const response = await fetch(apiUrl, {
      signal: abortSignal,
      credentials: "omit",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // CORS 오류 등으로 fetch 실패 시 JSONP로 폴백
    return fetchAnalyticsDataViaJsonp(apiUrl);
  }
}

/**
 * Analytics 조회 범위에 따라 페이지 경로 결정
 */
function resolveAnalyticsPagePath(
  scope: AnalyticsScope,
  pagePath?: string,
): string | undefined {
  if (scope === "site") return undefined;
  if (pagePath) return pagePath;
  return typeof window !== "undefined" ? window.location.pathname : "/";
}

/**
 * Google Analytics API URL 생성
 */
function buildAnalyticsApiUrl(
  baseApiUrl: string,
  scope: AnalyticsScope,
  pagePath: string | undefined,
  startDate: string,
  endDate: string,
): string | null {
  if (!baseApiUrl) return null;
  const url = new URL(baseApiUrl);
  url.searchParams.set("scope", scope);
  if (pagePath) url.searchParams.set("path", pagePath);
  url.searchParams.set("start", startDate);
  url.searchParams.set("end", endDate);
  return url.toString();
}

// ===== 메인 훅 =====

/**
 * Google Analytics 페이지 통계 데이터를 조회하는 훅
 *
 * @example
 * ```tsx
 * const { loading, error, totals, pageDataList } = useGoogleAnalyticsStats({
 *   apiUrl: "https://api.example.com/analytics",
 *   scope: "page",
 *   pagePath: "/about",
 * });
 * ```
 */
export function useGoogleAnalyticsStats({
  apiUrl,
  scope = "page",
  pagePath,
  startDate = DEFAULT_DATE_RANGE_START,
  endDate = DEFAULT_DATE_RANGE_END,
  cacheTtlSeconds = DEFAULT_CACHE_TTL_SECONDS,
  shouldForceJsonp = false,
  enabled = true,
}: UseGoogleAnalyticsStatsOptions): UseGoogleAnalyticsStatsResult {
  const [state, setState] = useState<UseGoogleAnalyticsStatsResult>({
    loading: true,
    error: null,
    totals: null,
    pageDataList: [],
  });

  const cacheRef = useRef(
    new AnalyticsCacheManager<AnalyticsApiResponse>({
      validator: (response) => response.ok === true,
    }),
  );
  const cancellationControllerRef = useRef(new RequestCancellationController());

  const analyticsApiUrl = useMemo(() => {
    if (!apiUrl) return null;
    const resolvedPagePath = resolveAnalyticsPagePath(scope, pagePath);
    return buildAnalyticsApiUrl(
      apiUrl,
      scope,
      resolvedPagePath,
      startDate,
      endDate,
    );
  }, [apiUrl, scope, pagePath, startDate, endDate]);

  useEffect(() => {
    if (!enabled || !analyticsApiUrl) {
      setState({
        loading: false,
        error: null,
        totals: null,
        pageDataList: [],
      });
      return;
    }

    const cancellationController = cancellationControllerRef.current;
    const cache = cacheRef.current;
    cancellationController.reset();

    setState({
      loading: true,
      error: null,
      totals: null,
      pageDataList: [],
    });

    const fetchAndUpdateState = async () => {
      const abortSignal = cancellationController.createAbortSignal();
      const cachedResponse = cache.get(analyticsApiUrl, cacheTtlSeconds);

      // 캐시된 데이터가 있으면 사용
      if (cachedResponse) {
        if (!cancellationController.hasBeenCancelled()) {
          setState({
            loading: false,
            error: null,
            totals: cachedResponse.totals ?? null,
            pageDataList: cachedResponse.rows ?? [],
          });
        }
        return;
      }

      // API에서 데이터 조회
      try {
        const response = await fetchAnalyticsData(
          analyticsApiUrl,
          abortSignal,
          shouldForceJsonp,
        );

        if (cancellationController.hasBeenCancelled()) return;

        if (!response?.ok) {
          setState({
            loading: false,
            error: response?.error || "API 오류가 발생했습니다",
            totals: null,
            pageDataList: [],
          });
          return;
        }

        // 캐시에 저장
        cache.set(analyticsApiUrl, response);

        if (!cancellationController.hasBeenCancelled()) {
          setState({
            loading: false,
            error: null,
            totals: response.totals ?? null,
            pageDataList: response.rows ?? [],
          });
        }
      } catch (error) {
        if (!cancellationController.hasBeenCancelled()) {
          setState({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "네트워크 오류가 발생했습니다",
            totals: null,
            pageDataList: [],
          });
        }
      }
    };

    fetchAndUpdateState();

    return () => cancellationController.cancelAllRequests();
  }, [analyticsApiUrl, cacheTtlSeconds, shouldForceJsonp, enabled]);

  return state;
}

// ===== 편의 훅 =====

/**
 * 전체 사이트의 Google Analytics 통계를 조회하는 편의 훅
 */
type UseAllSiteAnalyticsOptions = {
  apiUrl: string;
  startDate?: string;
  endDate?: string;
  cacheTtlSeconds?: number;
  shouldForceJsonp?: boolean;
  enabled?: boolean;
};

export function useAllSiteAnalytics({
  apiUrl,
  startDate = DEFAULT_DATE_RANGE_START,
  endDate = DEFAULT_DATE_RANGE_END,
  cacheTtlSeconds = DEFAULT_CACHE_TTL_SECONDS,
  shouldForceJsonp = false,
  enabled = true,
}: UseAllSiteAnalyticsOptions): UseGoogleAnalyticsStatsResult {
  return useGoogleAnalyticsStats({
    apiUrl,
    scope: "site",
    startDate,
    endDate,
    cacheTtlSeconds,
    shouldForceJsonp,
    enabled,
  });
}
