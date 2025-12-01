import { Suspense, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AnalyticsPageData } from "@mfe/shared";
import { LoadingSkeleton } from "@srf/ui";

// Analytics 데이터 페칭 함수
async function fetchAllSiteAnalytics(
  apiUrl: string,
): Promise<AnalyticsPageData[]> {
  if (!apiUrl) {
    throw new Error("VITE_GA_API_URL이 설정되지 않았습니다");
  }

  try {
    const requestUrl = new URL(apiUrl);
    requestUrl.searchParams.set("scope", "site");
    requestUrl.searchParams.set("start", "30daysAgo");
    requestUrl.searchParams.set("end", "today");

    try {
      const response = await fetch(requestUrl.toString(), {
        credentials: "omit",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data?.ok) {
        throw new Error(data?.error || "API 오류가 발생했습니다");
      }

      // /my-blog로 시작하지 않는 경로 필터링
      return (data.rows || []).filter((pageData: AnalyticsPageData) =>
        pageData.path.startsWith("/my-blog"),
      );
    } catch (error) {
      // JSONP 폴백 시도
      return fetchAllSiteAnalyticsWithJsonp(requestUrl.toString());
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Invalid URL")) {
      throw new Error("유효하지 않은 API URL입니다");
    }
    throw error;
  }
}

// JSONP를 사용한 데이터 페칭 (CORS 우회)
function fetchAllSiteAnalyticsWithJsonp(
  apiUrl: string,
): Promise<AnalyticsPageData[]> {
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
      if (uniqueCallbackName in window) {
        delete (window as any)[uniqueCallbackName];
      }
    };

    const resolvePromiseOnce = (value: AnalyticsPageData[]) => {
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
      15000,
    );

    (window as any)[uniqueCallbackName] = (data: any) => {
      if (!data?.ok) {
        rejectPromiseOnce(new Error(data?.error || "API 오류가 발생했습니다"));
        return;
      }

      const filteredData = (data.rows || []).filter(
        (pageData: AnalyticsPageData) => pageData.path.startsWith("/my-blog"),
      );
      resolvePromiseOnce(filteredData);
    };

    jsonpScriptElement.onerror = () =>
      rejectPromiseOnce(new Error("JSONP 스크립트 로드 실패"));
    jsonpScriptElement.async = true;

    const urlQuerySeparator = apiUrl.includes("?") ? "&" : "?";
    jsonpScriptElement.src = `${apiUrl}${urlQuerySeparator}callback=${uniqueCallbackName}`;
    document.body.appendChild(jsonpScriptElement);
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
