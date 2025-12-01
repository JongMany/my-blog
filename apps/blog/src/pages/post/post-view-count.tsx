import { Suspense, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AnalyticsPageData } from "@mfe/shared";
import { LoadingSkeleton } from "@srf/ui";

// Analytics API 응답 타입
type AnalyticsApiResponse = {
  ok: boolean;
  rows?: AnalyticsPageData[];
  error?: string;
};

// JSONP 콜백 함수 타입
type JsonpCallback = (data: AnalyticsApiResponse) => void;

// window 객체에 동적 속성 추가를 위한 타입 (Record 사용)
type WindowWithJsonpCallback = Window & Record<string, JsonpCallback | unknown>;

/**
 * JSONP로 Analytics API 호출 (CORS 우회)
 *
 * JSONP 동작 방식:
 * 1. 동적으로 <script> 태그 생성
 * 2. 서버 URL에 callback 파라미터로 함수명 전달
 * 3. 서버는 해당 함수를 호출하는 JS 코드 반환 (예: callbackName({data: ...}))
 * 4. 브라우저가 스크립트 실행 → 전역 함수 호출 → Promise resolve
 */
function fetchWithJsonp(url: string): Promise<AnalyticsApiResponse> {
  return new Promise((resolve, reject) => {
    // 고유한 콜백 함수명 생성 (여러 요청이 동시에 있어도 충돌 방지)
    const callback = `__analytics_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");

    // 중복 실행 방지 플래그 (타임아웃과 콜백이 동시에 실행되는 경우 방지)
    let finished = false;
    const windowWithCallback = window as unknown as WindowWithJsonpCallback;

    // 리소스 정리 함수 (메모리 누수 방지)
    // - 스크립트 태그 제거
    // - 전역 콜백 함수 제거
    const cleanup = () => {
      if (finished) return; // 이미 정리됨
      finished = true;
      script.remove();
      delete windowWithCallback[callback];
    };

    // 타임아웃 설정 (15초 후 자동 실패 처리)
    // 네트워크 문제로 응답이 오지 않을 때 무한 대기 방지
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("요청 시간 초과"));
    }, 15000);

    // 서버에서 호출할 콜백 함수 (전역 스코프에 등록)
    // 서버가 반환한 스크립트가 이 함수를 호출함
    const jsonpCallback: JsonpCallback = (data: AnalyticsApiResponse) => {
      cleanup(); // 리소스 정리
      clearTimeout(timeout); // 타임아웃 취소
      if (data?.ok) {
        resolve(data);
      } else {
        reject(new Error(data?.error || "API 오류"));
      }
    };

    // ⭐ 중요: 전역 스코프에 콜백 함수 등록
    // 예: callback = "__analytics_123" 이면 window.__analytics_123 = jsonpCallback
    // 이렇게 등록해야 서버가 반환한 스크립트에서 이 함수를 호출할 수 있음
    windowWithCallback[callback] = jsonpCallback;

    // 스크립트 로드 실패 처리 (네트워크 오류, 404 등)
    script.onerror = () => {
      cleanup();
      clearTimeout(timeout);
      reject(new Error("스크립트 로드 실패"));
    };

    // JSONP 요청 시작
    // 예: "https://api.example.com?callback=__analytics_123"
    // 서버는 이 URL을 받아서 다음과 같은 JavaScript 코드를 반환:
    // "__analytics_123({ok: true, rows: [...]})"
    // 브라우저가 이 스크립트를 실행하면 → window.__analytics_123()이 자동 호출됨
    // → 위에서 등록한 jsonpCallback 함수가 실행됨
    script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${callback}`;
    document.body.appendChild(script);
  });
}

// 전체 사이트 Analytics 데이터 가져오기
async function fetchAllSiteAnalytics(
  apiUrl: string,
): Promise<AnalyticsPageData[]> {
  if (!apiUrl) {
    throw new Error("VITE_GA_API_URL이 설정되지 않았습니다");
  }

  const url = new URL(apiUrl);
  url.searchParams.set("scope", "site");
  url.searchParams.set("start", "30daysAgo");
  url.searchParams.set("end", "today");

  const data = await fetchWithJsonp(url.toString());

  return (data.rows || []).filter((pageData: AnalyticsPageData) =>
    pageData.path.startsWith("/my-blog"),
  );
}

// View Count를 표시하는 컴포넌트 (Suspense 내부)
function ViewCountContent({ postSlug }: { postSlug: string }) {
  const apiUrl = import.meta.env.VITE_GA_API_URL;

  const { data: pageDataList = [] } = useSuspenseQuery({
    queryKey: ["allSiteAnalytics", apiUrl],
    queryFn: () => fetchAllSiteAnalytics(apiUrl),
    staleTime: 60 * 1000, // 60초
  });

  const count = useMemo(() => {
    return (
      pageDataList.find((pageData) => pageData.path.endsWith(postSlug))
        ?.views ?? 0
    );
  }, [pageDataList, postSlug]);

  return <span>{count}</span>;
}

// View Count Skeleton 컴포넌트
export function ViewCountSkeleton() {
  return <LoadingSkeleton width="1rem" height="0.75rem" />;
}

// View Count 컴포넌트 (Suspense로 감싸진)
export function PostViewCount({ postSlug }: { postSlug: string }) {
  const apiUrl = import.meta.env.VITE_GA_API_URL ?? "";

  // API URL이 없으면 count를 표시하지 않음
  if (!apiUrl) {
    console.error("VITE_GA_API_URL이 설정되지 않았습니다");
    return null;
  }

  return (
    <Suspense fallback={<ViewCountSkeleton />}>
      <ViewCountContent postSlug={postSlug} />
    </Suspense>
  );
}
