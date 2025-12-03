import type { LogMeta, Item } from "@/types/contents/log";
import { parseContentModules, findContentById } from "@/utils/content-parser";

// ⚠️ Vite는 리터럴 문자열만 허용하므로, 경로를 직접 지정해야 합니다.
const modules = import.meta.glob<string>("../contents/logs/**/*.{md,mdx}", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * 모든 로그를 가져옵니다.
 */
export function getLogs(): Item<LogMeta>[] {
  return parseContentModules<LogMeta>(modules, { category: "logs" });
}

/**
 * 특정 ID의 로그를 가져옵니다.
 * published가 false인 로그는 반환하지 않습니다.
 */
export function getLog(id: string): Item<LogMeta> | undefined {
  return findContentById(getLogs(), id);
}
