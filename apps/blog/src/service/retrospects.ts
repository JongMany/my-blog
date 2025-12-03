import type { RetrospectMeta, Item } from "@/types/contents/retrospect";
import { parseContentModules, findContentById } from "@/utils/content-parser";

// ⚠️ Vite는 리터럴 문자열만 허용하므로, 경로를 직접 지정해야 합니다.
const modules = import.meta.glob<string>(
  "../contents/retrospect/**/*.{md,mdx}",
  {
    eager: true,
    query: "?raw",
    import: "default",
  }
);

/**
 * 모든 회고를 가져옵니다.
 */
export function getRetrospects(): Item<RetrospectMeta>[] {
  return parseContentModules<RetrospectMeta>(modules, { category: "retrospect" });
}

/**
 * 특정 ID의 회고를 가져옵니다.
 * published가 false인 회고는 반환하지 않습니다.
 */
export function getRetrospect(id: string): Item<RetrospectMeta> | undefined {
  return findContentById(getRetrospects(), id);
}
