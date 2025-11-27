import { useMemo } from "react";
import type { Bullet } from "../types";

/**
 * 불릿 리스트 관련 훅들
 */

/**
 * 불릿 리스트의 최대 깊이를 계산하는 훅
 *
 * @param items - 불릿 아이템들
 * @returns 최대 중첩 깊이
 */
export function useMaxDepth(items: Bullet[]): number {
  return useMemo(() => {
    function calculateDepth(bullets: Bullet[], currentDepth = 0): number {
      let maxDepth = currentDepth;

      for (const bullet of bullets) {
        if (bullet.children?.length) {
          const childDepth = calculateDepth(bullet.children, currentDepth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        }
      }

      return maxDepth;
    }

    return calculateDepth(items);
  }, [items]);
}

/**
 * 불릿 리스트의 총 아이템 수를 계산하는 훅
 *
 * @param items - 불릿 아이템들
 * @returns 총 아이템 수 (중첩 포함)
 */
export function useTotalItemCount(items: Bullet[]): number {
  return useMemo(() => {
    function countItems(bullets: Bullet[]): number {
      let count = bullets.length;

      for (const bullet of bullets) {
        if (bullet.children?.length) {
          count += countItems(bullet.children);
        }
      }

      return count;
    }

    return countItems(items);
  }, [items]);
}
