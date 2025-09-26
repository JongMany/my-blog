import { assetUrl } from "@mfe/shared";
import { useQuery } from "@tanstack/react-query";

// 상수 정의
const BLOG_ASSET_PREFIX = "blog" as const;
const CACHE_POLICY = "no-store" as const;
const STALE_TIME_MS = 60_000; // 1분
const BLOG_INDEX_PATH = "_blog/index.json" as const;

// 에러 메시지 상수
const ERROR_MESSAGES = {
  BLOG_INDEX_LOAD_FAILED: "블로그 인덱스를 불러올 수 없습니다",
  MDX_LOAD_FAILED: "MDX 파일을 불러올 수 없습니다",
} as const;

// 날짜 파트 타입
export type DateParts = {
  y: number; // year
  m: number; // month
  d: number; // day
  hh: number; // hour
  mm: number; // minute
  tz: string; // timezone
};

// 블로그 포스트 메타데이터 타입
export type BlogPostMeta = {
  // 기본 정보
  category: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  cover: string | null;
  path: string;

  // 날짜 정보 (원본)
  date: string; // ISO string with seconds
  updatedAt: string; // ISO string with seconds

  // 날짜 정보 (처리된)
  dateMinute: string; // ISO string without seconds
  updatedMinute: string; // ISO string without seconds
  dateParts: DateParts | null;
  updatedParts: DateParts | null;

  // 정렬/필터 편의를 위한 타임스탬프
  createdAtMs: number;
  updatedAtMs: number;
};

// 블로그 인덱스 타입
export type BlogIndex = {
  categories: string[];
  byCategory: Record<string, BlogPostMeta[]>;
  all: BlogPostMeta[];
};

// API 응답 타입 (부분적 데이터 허용)
type BlogIndexResponse = Partial<BlogIndex> & {
  byCategory?: BlogIndex["byCategory"];
  all?: BlogIndex["all"];
};

// 유틸리티 함수들
function createBlogAssetUrl(path: string): string {
  return assetUrl(path, BLOG_ASSET_PREFIX);
}

function createFetchOptions(): RequestInit {
  return { cache: CACHE_POLICY };
}

function createError(message: string, status?: number): Error {
  const statusText = status ? ` (${status})` : "";
  return new Error(`${message}${statusText}`);
}

// API 함수들
export async function fetchBlogIndex(): Promise<BlogIndex> {
  const url = createBlogAssetUrl(BLOG_INDEX_PATH);
  const options = createFetchOptions();

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw createError(ERROR_MESSAGES.BLOG_INDEX_LOAD_FAILED, response.status);
    }

    const raw = (await response.json()) as BlogIndexResponse;

    // 카테고리 목록 생성 (없으면 byCategory 키에서 추출)
    const categories =
      raw.categories ??
      (raw.byCategory ? Object.keys(raw.byCategory).sort() : []);

    return {
      all: raw.all ?? [],
      byCategory: raw.byCategory ?? {},
      categories,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw createError(ERROR_MESSAGES.BLOG_INDEX_LOAD_FAILED);
  }
}

export async function fetchPostMdx(path: string): Promise<string> {
  const url = createBlogAssetUrl(path);
  const options = createFetchOptions();

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw createError(ERROR_MESSAGES.MDX_LOAD_FAILED, response.status);
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw createError(ERROR_MESSAGES.MDX_LOAD_FAILED);
  }
}

// React Query 훅
export function useBlogIndex() {
  return useQuery({
    queryKey: ["blog-index"],
    queryFn: fetchBlogIndex,
    staleTime: STALE_TIME_MS,
    refetchOnWindowFocus: false,
  });
}

// 편의 함수들
export function createPostMdxPath(category: string, slug: string): string {
  return `_blog/${category}/${slug}.mdx`;
}

export function findPostByCategoryAndSlug(
  data: BlogIndex | undefined,
  category: string,
  slug: string,
): BlogPostMeta | null {
  if (!data) return null;
  return (
    data.all.find((post) => post.category === category && post.slug === slug) ??
    null
  );
}
