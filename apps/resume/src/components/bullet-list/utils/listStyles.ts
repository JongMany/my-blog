import { cn } from "@srf/ui";

/**
 * 불릿 리스트의 레벨별 스타일을 반환하는 순수함수
 *
 * @description
 * - 레벨 0: 원형 마커 (disc) + 기본 크기
 * - 레벨 1: 원형 마커 (circle) + 작은 크기
 * - 레벨 2+: 사각형 마커 (square) + 작은 크기
 *
 * @param level - 중첩 레벨 (0부터 시작)
 * @returns 해당 레벨에 맞는 CSS 클래스 문자열
 *
 * @example
 * ```typescript
 * getListStyles(0) // "text-[13px] list-disc marker:text-[var(--primary)] pl-5 space-y-1.5"
 * getListStyles(1) // "text-[13px] list-[circle] pl-5 space-y-1 text-[12px]"
 * getListStyles(2) // "text-[13px] list-[square] pl-5 space-y-1 text-[12px]"
 * ```
 */
export function getListStyles(level: number): string {
  const baseStyles = "text-[13px]";

  const levelStyles = {
    0: "list-disc marker:text-[var(--primary)] pl-5 space-y-1.5",
    1: "list-[circle] pl-5 space-y-1 text-[12px]",
    2: "list-[square] pl-5 space-y-1 text-[12px]",
  } as const;

  return cn(
    baseStyles,
    levelStyles[level as keyof typeof levelStyles] || levelStyles[2],
  );
}
