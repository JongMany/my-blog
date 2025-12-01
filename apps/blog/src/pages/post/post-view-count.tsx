import { Suspense, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AnalyticsPageData } from "@mfe/shared";
import { LoadingSkeleton } from "@srf/ui";

/**
 * 전체 사이트의 Google Analytics 페이지 조회수 데이터를 가져오는 함수
 *
 * @description
 * - Google Apps Script로 구현된 Analytics API를 JSONP 방식으로 호출합니다
 * - CORS 제한을 우회하기 위해 JSONP(JSON with Padding) 방식을 사용합니다
 * - 전체 사이트의 모든 페이지 조회수를 한 번에 가져옵니다
 * - /my-blog로 시작하는 경로만 필터링하여 반환합니다
 *
 * @param apiUrl - Google Apps Script 웹앱 URL
 * @returns 페이지별 조회수 데이터 배열 (AnalyticsPageData[])
 * @throws API URL이 없거나 요청 실패 시 에러를 throw합니다
 */
async function fetchAllSiteAnalytics(
  apiUrl: string,
): Promise<AnalyticsPageData[]> {
  if (!apiUrl) {
    throw new Error("VITE_GA_API_URL이 설정되지 않았습니다");
  }

  // API 요청 URL 구성 (전체 사이트 통계, 최근 30일)
  const url = new URL(apiUrl);
  url.searchParams.set("scope", "site");
  url.searchParams.set("start", "30daysAgo");
  url.searchParams.set("end", "today");

  // JSONP를 사용한 비동기 요청 (CORS 우회)
  return new Promise((resolve, reject) => {
    // 고유한 콜백 함수명 생성 (전역 스코프에 등록될 함수)
    const callback = `__analytics_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
    const script = document.createElement("script");
    let done = false;

    // 정리 함수: 스크립트 태그와 전역 콜백 함수 제거
    const finish = () => {
      if (done) return;
      done = true;
      script.remove();
      delete (window as any)[callback];
    };

    // 15초 타임아웃 설정
    const timeout = setTimeout(() => {
      finish();
      reject(new Error("요청 시간 초과"));
    }, 15000);

    // 전역 콜백 함수 등록 (서버에서 호출될 함수)
    (window as any)[callback] = (data: any) => {
      finish();
      clearTimeout(timeout);

      if (!data?.ok) {
        reject(new Error(data?.error || "API 오류"));
        return;
      }

      // /my-blog로 시작하는 경로만 필터링
      const filtered = (data.rows || []).filter((pageData: AnalyticsPageData) =>
        pageData.path.startsWith("/my-blog"),
      );
      resolve(filtered);
    };

    // 스크립트 로드 실패 처리
    script.onerror = () => {
      finish();
      clearTimeout(timeout);
      reject(new Error("스크립트 로드 실패"));
    };

    // JSONP 요청: 스크립트 태그를 동적으로 추가하여 데이터 가져오기
    script.src = `${url.toString()}${url.toString().includes("?") ? "&" : "?"}callback=${callback}`;
    document.body.appendChild(script);
  });
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
