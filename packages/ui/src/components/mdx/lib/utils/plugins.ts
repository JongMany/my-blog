import type { RehypePlugin } from "../../types";

/**
 * 플러그인 배열에서 특정 플러그인을 제거하는 유틸리티
 *
 * @param plugins - 플러그인 배열
 * @param targetPlugin - 제거할 대상 플러그인
 * @returns 대상 플러그인이 제거된 새로운 플러그인 배열
 */
export function removePlugin(
  plugins: RehypePlugin[],
  targetPlugin: unknown,
): RehypePlugin[] {
  return plugins.filter((plugin) => {
    if (Array.isArray(plugin)) {
      return plugin[0] !== targetPlugin;
    }
    return plugin !== targetPlugin;
  });
}

