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
export type AnalyticsPageData = {
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

  private loadCacheStoreFromStorage(): Record<string, CacheEntry<T>> {
    if (!this.storage) return {};
    try {
      const cachedDataString = this.storage.getItem(this.cacheKey);
      return cachedDataString ? JSON.parse(cachedDataString) : {};
    } catch {
      return {};
    }
  }

  /**
   * 캐시에 데이터를 저장합니다.
   */
  set(key: string, value: T): void {
    if (!this.storage) return;
    try {
      const cacheStore = this.loadCacheStoreFromStorage();
      cacheStore[key] = { timestamp: Date.now(), value };
      this.storage.setItem(this.cacheKey, JSON.stringify(cacheStore));
    } catch {
      // 스토리지 오류는 무시 (용량 초과 등)
    }
  }

  /**
   * 캐시에서 데이터를 조회합니다.
   * @param key 캐시 키
   * @param ttlSeconds 캐시 유효 시간 (초). 지정하지 않으면 만료되지 않음
   * @returns 캐시된 데이터 또는 null
   */
  get(key: string, ttlSeconds?: number): T | null {
    const cacheStore = this.loadCacheStoreFromStorage();
    const cacheEntry = cacheStore[key];
    if (!cacheEntry) return null;

    // TTL 체크
    if (ttlSeconds !== undefined) {
      const cacheAgeInMilliseconds = Date.now() - cacheEntry.timestamp;
      const isCacheExpired = cacheAgeInMilliseconds >= ttlSeconds * 1000;
      if (isCacheExpired) return null;
    }

    // 유효성 검사
    if (this.validator && !this.validator(cacheEntry.value)) return null;

    return cacheEntry.value;
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
type JsonpCallbackFunction = (data: AnalyticsApiResponse) => void;

/**
 * window 객체에 JSONP 콜백 함수를 안전하게 등록합니다.
 */
function registerJsonpCallbackOnWindow(
  callbackFunctionName: string,
  callbackFunction: JsonpCallbackFunction,
): void {
  const windowWithCallback = window as unknown as Record<
    string,
    JsonpCallbackFunction | undefined
  >;
  windowWithCallback[callbackFunctionName] = callbackFunction;
}

/**
 * window 객체에서 JSONP 콜백 함수를 안전하게 제거합니다.
 */
function unregisterJsonpCallbackFromWindow(callbackFunctionName: string): void {
  const windowWithCallback = window as unknown as Record<
    string,
    JsonpCallbackFunction | undefined
  >;
  if (callbackFunctionName in windowWithCallback) {
    delete windowWithCallback[callbackFunctionName];
  }
}

/**
 * JSONP를 사용하여 Google Analytics API 데이터를 조회합니다.
 * CORS 제한을 우회하기 위해 사용됩니다.
 */
function fetchAnalyticsDataUsingJsonp(
  apiUrl: string,
): Promise<AnalyticsApiResponse> {
  return new Promise((resolve, reject) => {
    const uniqueCallbackName = `__analytics_jsonp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
    const jsonpScriptElement = document.createElement("script");
    let hasAlreadyResolved = false;
    let requestTimeoutId: ReturnType<typeof setTimeout>;

    const cleanupJsonpResources = () => {
      clearTimeout(requestTimeoutId);
      if (jsonpScriptElement.parentNode) {
        jsonpScriptElement.remove();
      }
      unregisterJsonpCallbackFromWindow(uniqueCallbackName);
    };

    const resolvePromiseOnce = (value: AnalyticsApiResponse) => {
      if (hasAlreadyResolved) return;
      hasAlreadyResolved = true;
      cleanupJsonpResources();
      resolve(value);
    };

    const rejectPromiseOnce = (error: Error) => {
      if (hasAlreadyResolved) return;
      hasAlreadyResolved = true;
      cleanupJsonpResources();
      reject(error);
    };

    requestTimeoutId = setTimeout(
      () => rejectPromiseOnce(new Error("JSONP 요청 시간 초과")),
      JSONP_REQUEST_TIMEOUT_MS,
    );

    const jsonpCallbackHandler: JsonpCallbackFunction = (
      data: AnalyticsApiResponse,
    ) => resolvePromiseOnce(data);
    registerJsonpCallbackOnWindow(uniqueCallbackName, jsonpCallbackHandler);

    jsonpScriptElement.onerror = () =>
      rejectPromiseOnce(new Error("JSONP 스크립트 로드 실패"));
    jsonpScriptElement.async = true;

    const urlQuerySeparator = apiUrl.includes("?") ? "&" : "?";
    jsonpScriptElement.src = `${apiUrl}${urlQuerySeparator}callback=${uniqueCallbackName}`;
    document.body.appendChild(jsonpScriptElement);
  });
}

/**
 * Google Analytics API 데이터를 조회합니다.
 * fetch를 시도하고 실패 시 JSONP로 폴백합니다.
 */
async function fetchAnalyticsDataFromApi(
  apiUrl: string,
  abortSignal: AbortSignal,
  shouldForceJsonp: boolean,
): Promise<AnalyticsApiResponse> {
  if (shouldForceJsonp) {
    return fetchAnalyticsDataUsingJsonp(apiUrl);
  }

  try {
    const httpResponse = await fetch(apiUrl, {
      signal: abortSignal,
      credentials: "omit",
      cache: "no-store",
    });

    if (!httpResponse.ok) {
      throw new Error(
        `HTTP ${httpResponse.status}: ${httpResponse.statusText}`,
      );
    }

    return await httpResponse.json();
  } catch (error) {
    // CORS 오류 등으로 fetch 실패 시 JSONP로 폴백
    return fetchAnalyticsDataUsingJsonp(apiUrl);
  }
}

/**
 * Analytics 조회 범위에 따라 실제 조회할 페이지 경로를 결정합니다.
 */
function determineTargetPagePathForAnalytics(
  scope: AnalyticsScope,
  pagePath?: string,
): string | undefined {
  if (scope === "site") return undefined;
  if (pagePath) return pagePath;
  return typeof window !== "undefined" ? window.location.pathname : "/";
}

/**
 * Google Analytics API 요청 URL을 생성합니다.
 */
function constructAnalyticsApiRequestUrl(
  baseApiUrl: string,
  scope: AnalyticsScope,
  pagePath: string | undefined,
  startDate: string,
  endDate: string,
): string | null {
  if (!baseApiUrl) return null;
  const requestUrl = new URL(baseApiUrl);
  requestUrl.searchParams.set("scope", scope);
  if (pagePath) requestUrl.searchParams.set("path", pagePath);
  requestUrl.searchParams.set("start", startDate);
  requestUrl.searchParams.set("end", endDate);
  return requestUrl.toString();
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
    const targetPagePath = determineTargetPagePathForAnalytics(scope, pagePath);
    return constructAnalyticsApiRequestUrl(
      apiUrl,
      scope,
      targetPagePath,
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

    const fetchAnalyticsDataAndUpdateState = async () => {
      const requestAbortSignal = cancellationController.createAbortSignal();
      const cachedAnalyticsResponse = cache.get(
        analyticsApiUrl,
        cacheTtlSeconds,
      );

      // 캐시된 데이터가 있으면 사용
      if (cachedAnalyticsResponse) {
        if (!cancellationController.hasBeenCancelled()) {
          setState({
            loading: false,
            error: null,
            totals: cachedAnalyticsResponse.totals ?? null,
            pageDataList: cachedAnalyticsResponse.rows ?? [],
          });
        }
        return;
      }

      // API에서 데이터 조회
      try {
        const analyticsApiResponse = await fetchAnalyticsDataFromApi(
          analyticsApiUrl,
          requestAbortSignal,
          shouldForceJsonp,
        );

        if (cancellationController.hasBeenCancelled()) return;

        if (!analyticsApiResponse?.ok) {
          setState({
            loading: false,
            error: analyticsApiResponse?.error || "API 오류가 발생했습니다",
            totals: null,
            pageDataList: [],
          });
          return;
        }

        // 캐시에 저장
        cache.set(analyticsApiUrl, analyticsApiResponse);

        if (!cancellationController.hasBeenCancelled()) {
          setState({
            loading: false,
            error: null,
            totals: analyticsApiResponse.totals ?? null,
            pageDataList: analyticsApiResponse.rows ?? [],
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

    fetchAnalyticsDataAndUpdateState();

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
  const result = useGoogleAnalyticsStats({
    apiUrl,
    scope: "site",
    startDate,
    endDate,
    cacheTtlSeconds,
    shouldForceJsonp,
    enabled,
  });

  // /my-blog로 시작하지 않는 경로 필터링
  const filteredPageDataList = useMemo(() => {
    return result.pageDataList.filter((pageData) =>
      pageData.path.startsWith("/my-blog"),
    );
  }, [result.pageDataList]);

  return {
    ...result,
    pageDataList: filteredPageDataList,
  };
}
