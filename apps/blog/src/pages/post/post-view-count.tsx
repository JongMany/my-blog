import { Suspense, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingSkeleton } from "@srf/ui";
import { fetchAllSiteAnalytics } from "@mfe/shared";

// View Count를 표시하는 컴포넌트 (Suspense 내부)
function ViewCountContent({ postSlug }: { postSlug: string }) {
  const apiUrl = import.meta.env.VITE_GA_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_GA_API_URL이 설정되지 않았습니다");
  }

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
