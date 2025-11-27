/**
 * 네비게이션 훅에서 사용하는 순수 함수 유틸리티
 */

export interface SectionItem {
  id: string;
  label: string;
}

/**
 * 해시에서 활성 섹션 ID를 추출합니다.
 *
 * @param hash - URL 해시 값 (예: "section1")
 * @param items - 섹션 아이템 배열
 * @returns 매칭되는 섹션 ID 또는 null
 */
export function getActiveIdFromHash(
  hash: string,
  items: SectionItem[],
): string | null {
  if (!hash) return null;
  return items.find((item) => item.id === hash)?.id ?? null;
}

/**
 * IntersectionObserver entries에서 offset에 가장 가까운 섹션을 찾습니다.
 *
 * @param entries - IntersectionObserver의 entries 배열
 * @param offset - 기준 오프셋 값
 * @returns 가장 가까운 섹션의 ID 또는 null
 */
export function findClosestVisibleSection(
  entries: IntersectionObserverEntry[],
  offset: number,
): string | null {
  const visibleEntries = entries.filter((entry) => entry.isIntersecting);

  if (visibleEntries.length === 0) return null;

  const closest = visibleEntries.reduce((prev, current) => {
    const prevDistance = Math.abs(prev.boundingClientRect.top - offset);
    const currentDistance = Math.abs(current.boundingClientRect.top - offset);
    return currentDistance < prevDistance ? current : prev;
  });

  return closest.target?.id ?? null;
}

/**
 * 요소의 스크롤 위치를 계산합니다.
 *
 * @param elementTop - 요소의 getBoundingClientRect().top 값
 * @param scrollY - 현재 스크롤 Y 위치
 * @param offset - 오프셋 값
 * @returns 계산된 스크롤 위치
 */
export function calculateScrollTop(
  elementTop: number,
  scrollY: number,
  offset: number,
): number {
  return elementTop + scrollY - offset;
}

/**
 * 해시가 유효한 섹션 ID인지 확인합니다.
 *
 * @param hash - 확인할 해시 값
 * @param items - 섹션 아이템 배열
 * @returns 해시가 유효한 섹션 ID인지 여부
 */
export function isValidHash(
  hash: string | null,
  items: SectionItem[],
): boolean {
  if (!hash) return false;
  return items.some((item) => item.id === hash);
}
