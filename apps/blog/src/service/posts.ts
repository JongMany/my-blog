import type { PostMeta, Item } from "@/types/contents/post";
import { parseContentModules, findContentById } from "@/utils/content-parser";

// ⚠️ Vite는 리터럴 문자열만 허용하므로, 경로를 직접 지정해야 합니다.
const modules = import.meta.glob<string>("../contents/posts/**/*.{md,mdx}", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * 모든 포스트를 가져옵니다.
 */
export function getPosts(): Item<PostMeta>[] {
  return parseContentModules<PostMeta>(modules, { category: "posts" });
}

/**
 * 특정 ID의 포스트를 가져옵니다.
 * published가 false인 포스트는 반환하지 않습니다.
 */
export function getPost(id: string): Item<PostMeta> | undefined {
  return findContentById(getPosts(), id);
}
