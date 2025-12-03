import type { EconomyMeta, Item } from "@/types/contents/economy";
import { parseContentModules, findContentById } from "@/utils/content-parser";

// ⚠️ Vite는 리터럴 문자열만 허용하므로, 경로를 직접 지정해야 합니다.
const modules = import.meta.glob<string>("../contents/economy/**/*.{md,mdx}", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * 모든 경제 콘텐츠를 가져옵니다.
 */
export function getEconomies(): Item<EconomyMeta>[] {
  return parseContentModules<EconomyMeta>(modules, { category: "economy" });
}

/**
 * 특정 ID의 경제 콘텐츠를 가져옵니다.
 * published가 false인 콘텐츠는 반환하지 않습니다.
 */
export function getEconomy(id: string): Item<EconomyMeta> | undefined {
  return findContentById(getEconomies(), id);
}
