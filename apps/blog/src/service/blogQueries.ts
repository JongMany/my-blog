import { useQuery } from "@tanstack/react-query";
import { fetchBlogIndex, fetchPostMdx } from "./blogData";

// ============================================================================
// 상수 정의
// ============================================================================

const STALE_TIME_MS = 60_000; // 1분

// ============================================================================
// React Query 훅들
// ============================================================================

/**
 * 블로그 인덱스 데이터를 가져오는 React Query 훅
 * @returns {import("@tanstack/react-query").UseQueryResult<import("./blogData").BlogIndex, Error>}
 */
export function useBlogIndex() {
  return useQuery({
    queryKey: ["blog-index"],
    queryFn: fetchBlogIndex,
    staleTime: STALE_TIME_MS,
    refetchOnWindowFocus: false,
  });
}

/**
 * 특정 MDX 포스트 내용을 가져오는 React Query 훅
 * @param {string} path - MDX 파일 경로
 * @param {boolean} enabled - 쿼리 활성화 여부
 * @returns {import("@tanstack/react-query").UseQueryResult<string, Error>}
 */
export function usePostMdx(path: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["post-mdx", path],
    queryFn: () => fetchPostMdx(path),
    enabled: enabled && !!path,
    staleTime: STALE_TIME_MS,
    refetchOnWindowFocus: false,
  });
}
