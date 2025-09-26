import type { BlogIndex, BlogPostMeta } from "./blogData";

// ============================================================================
// 유틸리티 함수들
// ============================================================================

/**
 * MDX 파일의 경로를 생성합니다
 * @param {string} category - 포스트 카테고리
 * @param {string} slug - 포스트 슬러그
 * @returns {string} MDX 파일 경로 (e.g., "_blog/frontend/my-post.mdx")
 */
export function createPostMdxPath(category: string, slug: string): string {
  return `_blog/${category}/${slug}.mdx`;
}

/**
 * 블로그 인덱스에서 특정 카테고리와 슬러그에 해당하는 포스트를 찾습니다
 * @param {BlogIndex | undefined} data - 블로그 인덱스 데이터
 * @param {string} category - 찾을 포스트의 카테고리
 * @param {string} slug - 찾을 포스트의 슬러그
 * @returns {BlogPostMeta | null} 찾은 포스트 메타데이터 또는 null
 */
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

/**
 * 카테고리별 포스트 수를 가져옵니다
 * @param {BlogIndex | undefined} data - 블로그 인덱스 데이터
 * @param {string} category - 카테고리명
 * @returns {number} 해당 카테고리의 포스트 수
 */
export function getPostCountByCategory(
  data: BlogIndex | undefined,
  category: string,
): number {
  if (!data) return 0;
  return data.byCategory[category]?.length ?? 0;
}

/**
 * 전체 포스트 수를 가져옵니다
 * @param {BlogIndex | undefined} data - 블로그 인덱스 데이터
 * @returns {number} 전체 포스트 수
 */
export function getTotalPostCount(data: BlogIndex | undefined): number {
  if (!data) return 0;
  return data.all.length;
}

/**
 * 카테고리 목록을 가져옵니다
 * @param {BlogIndex | undefined} data - 블로그 인덱스 데이터
 * @returns {string[]} 카테고리 목록
 */
export function getCategories(data: BlogIndex | undefined): string[] {
  if (!data) return [];
  return data.categories;
}

/**
 * 특정 카테고리의 포스트 목록을 가져옵니다
 * @param {BlogIndex | undefined} data - 블로그 인덱스 데이터
 * @param {string} category - 카테고리명
 * @returns {BlogPostMeta[]} 해당 카테고리의 포스트 목록
 */
export function getPostsByCategory(
  data: BlogIndex | undefined,
  category: string,
): BlogPostMeta[] {
  if (!data) return [];
  return data.byCategory[category] ?? [];
}

/**
 * 모든 포스트 목록을 가져옵니다
 * @param {BlogIndex | undefined} data - 블로그 인덱스 데이터
 * @returns {BlogPostMeta[]} 모든 포스트 목록
 */
export function getAllPosts(data: BlogIndex | undefined): BlogPostMeta[] {
  if (!data) return [];
  return data.all;
}
