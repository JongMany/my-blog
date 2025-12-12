import { Suspense, useMemo, Component, type ReactNode, type ErrorInfo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingSkeleton } from "@srf/ui";
import { fetchAllSiteAnalytics } from "@mfe/shared";

const DEFAULT_SKELETON_SIZE = {
  width: "1rem",
  height: "0.75rem",
} as const;

const DEFAULT_PATH_PREFIX = "/my-blog";

type ViewCountErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ViewCountErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ViewCountErrorBoundary extends Component<
  ViewCountErrorBoundaryProps,
  ViewCountErrorBoundaryState
> {
  constructor(props: ViewCountErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ViewCountErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ViewCount 에러 발생:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}

type ViewCountProps = {
  /**
   * 페이지 경로
   * - 전체 경로: "/my-blog/blog/posts/type-safe-env"
   * - 상대 경로: "blog/posts/type-safe-env" (pathPrefix와 함께 사용)
   */
  path: string;
  /**
   * 경로 접두사 (상대 경로를 사용할 때)
   * 기본값: "/my-blog"
   */
  pathPrefix?: string;
  /**
   * Analytics API URL (기본값: import.meta.env.VITE_GA_API_URL)
   */
  apiUrl?: string;
  /**
   * Skeleton 크기
   */
  skeleton?: {
    width?: string;
    height?: string;
  };
};

/**
 * 페이지 조회수를 표시하는 컴포넌트
 *
 * @example
 * ```tsx
 * // 전체 경로 사용
 * <ViewCount path="/my-blog/blog/posts/type-safe-env" />
 *
 * // 상대 경로 사용 (pathPrefix 자동 적용)
 * <ViewCount path="blog/posts/type-safe-env" />
 * <ViewCount path="blog/logs/test" />
 * ```
 */
export function ViewCount({
  path,
  pathPrefix = DEFAULT_PATH_PREFIX,
  apiUrl: customApiUrl,
  skeleton = {},
}: ViewCountProps) {
  const apiUrl = customApiUrl ?? import.meta.env.VITE_GA_API_URL ?? "";

  // API URL이 없으면 count를 표시하지 않음
  if (!apiUrl) {
    console.error("VITE_GA_API_URL이 설정되지 않았습니다");
    return null;
  }

  const skeletonWidth = skeleton.width ?? DEFAULT_SKELETON_SIZE.width;
  const skeletonHeight = skeleton.height ?? DEFAULT_SKELETON_SIZE.height;

  return (
    <ViewCountErrorBoundary>
      <Suspense
        fallback={
          <ViewCountSkeleton width={skeletonWidth} height={skeletonHeight} />
        }
      >
        <ViewCountContent path={path} pathPrefix={pathPrefix} />
      </Suspense>
    </ViewCountErrorBoundary>
  );
}

function ViewCountContent({
  path,
  pathPrefix = DEFAULT_PATH_PREFIX,
}: Pick<ViewCountProps, "path" | "pathPrefix">) {
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
  const fullPath = path.startsWith("/") ? path : `${pathPrefix}/${path}`;

  const count = useMemo(() => {
    return (
      pageDataList.find((pageData) => pageData.path === fullPath)?.views ?? 0
    );
  }, [pageDataList, fullPath]);

  return <span>{count}</span>;
}

function ViewCountSkeleton({
  width = DEFAULT_SKELETON_SIZE.width,
  height = DEFAULT_SKELETON_SIZE.height,
}: Pick<NonNullable<ViewCountProps["skeleton"]>, "width" | "height">) {
  return <LoadingSkeleton width={width} height={height} />;
}
