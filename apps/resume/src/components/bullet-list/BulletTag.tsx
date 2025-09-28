import React from "react";
import { cn, SimpleCursorTooltip } from "@srf/ui";

interface BulletTagProps {
  /** 표시할 태그 텍스트 */
  tag: string;
  /** 고유 키 생성을 위한 접두사 */
  keyPrefix: string;
  /** 현재 depth 레벨 */
  level?: number;
}

/**
 * 불릿 아이템의 태그를 렌더링하는 컴포넌트
 *
 * @description
 * - 작은 원형 배지 형태로 태그 표시
 * - 호버 시 툴팁으로 태그 설명 제공
 * - 클릭 불가능한 정보성 태그
 *
 * @example
 * ```tsx
 * <BulletTag tag="React" keyPrefix="0-1" />
 * ```
 */
export const BulletTag = React.memo(function BulletTag({
  tag,
  keyPrefix,
  level = 0,
}: BulletTagProps) {
  // depth에 따른 텍스트 크기 결정
  const textSizeClass = level >= 2 ? "text-[9px]" : "text-[10px]";
  const paddingClass = level >= 2 ? "px-1.5 py-[1px]" : "px-2 py-[2px]";

  return (
    <SimpleCursorTooltip text={`${tag} 관련 작업`} delay={200}>
      <span
        className={cn(
          "rounded-full border border-[var(--border)] bg-[var(--surface)]",
          paddingClass,
          textSizeClass,
          "text-[var(--muted-fg)] cursor-help hover:text-[var(--primary)] transition-colors",
        )}
        role="button"
        tabIndex={0}
        aria-label={`${tag} 관련 작업 태그`}
      >
        #{tag}
      </span>
    </SimpleCursorTooltip>
  );
});
