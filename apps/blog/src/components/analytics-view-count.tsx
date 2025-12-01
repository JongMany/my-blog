import { Suspense, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingSkeleton } from "@srf/ui";
import { fetchAllSiteAnalytics } from "@mfe/shared";

// ===== 타입 =====

type AnalyticsViewCountProps = {
  /**
   * 페이지 경로 또는 slug
   * - 전체 경로: "/my-blog/blog/posts/type-safe-env"
   * - slug만: "type-safe-env" (pathPrefix와 함께 사용)
   */
  pagePath: string;
  /**
   * 경로 접두사 (slug만 제공한 경우 사용)
   * 기본값: "/my-blog"
   */
  pathPrefix?: string;
  /**
   * Analytics API URL
   * 기본값: import.meta.env.VITE_GA_API_URL
   */
  apiUrl?: string;
  /**
   * Skeleton 너비
   * 기본값: "1rem"
   */
  skeletonWidth?: string;
  /**
   * Skeleton 높이
   * 기본값: "0.75rem"
   */
  skeletonHeight?: string;
};

// ===== 내부 컴포넌트 =====

// View Count를 표시하는 컴포넌트 (Suspense 내부)
function ViewCountContent({
  pagePath,
  pathPrefix = "/my-blog",
}: {
  pagePath: string;
  pathPrefix?: string;
}) {
  const apiUrl = import.meta.env.VITE_GA_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_GA_API_URL이 설정되지 않았습니다");
  }

  const { data: pageDataList = [] } = useSuspenseQuery({
    queryKey: ["allSiteAnalytics", apiUrl],
    queryFn: () => fetchAllSiteAnalytics(apiUrl),
    staleTime: 60 * 1000, // 60초
  });

  // 전체 경로 구성
  const fullPath = pagePath.startsWith("/")
    ? pagePath
    : `${pathPrefix}/${pagePath}`;

  const count = useMemo(() => {
    return (
      pageDataList.find((pageData) => pageData.path === fullPath)?.views ?? 0
    );
  }, [pageDataList, fullPath]);

  return <span>{count}</span>;
}

// View Count Skeleton 컴포넌트
function ViewCountSkeleton({
  width = "1rem",
  height = "0.75rem",
}: {
  width?: string;
  height?: string;
}) {
  return <LoadingSkeleton width={width} height={height} />;
}

// ===== 공개 컴포넌트 =====

/**
 * Analytics 조회수를 표시하는 컴포넌트
 *
 * @example
 * ```tsx
 * // 전체 경로 사용
 * <AnalyticsViewCount pagePath="/my-blog/blog/posts/type-safe-env" />
 *
 * // slug만 사용 (pathPrefix 자동 적용)
 * <AnalyticsViewCount pagePath="type-safe-env" pathPrefix="/my-blog/blog/posts" />
 *
 * // 다른 페이지 타입
 * <AnalyticsViewCount pagePath="some-book" pathPrefix="/my-blog/blog/books" />
 * ```
 */
export function AnalyticsViewCount({
  pagePath,
  pathPrefix = "/my-blog",
  apiUrl: customApiUrl,
  skeletonWidth = "1rem",
  skeletonHeight = "0.75rem",
}: AnalyticsViewCountProps) {
  const apiUrl = customApiUrl ?? import.meta.env.VITE_GA_API_URL ?? "";

  // API URL이 없으면 count를 표시하지 않음
  if (!apiUrl) {
    console.error("VITE_GA_API_URL이 설정되지 않았습니다");
    return null;
  }

  return (
    <Suspense fallback={<ViewCountSkeleton width={skeletonWidth} height={skeletonHeight} />}>
      <ViewCountContent pagePath={pagePath} pathPrefix={pathPrefix} />
    </Suspense>
  );
}

