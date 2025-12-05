import type { ComponentType } from "react";

/**
 * 순수 함수: 컴포넌트 맵 병합
 * 나중에 추가된 컴포넌트가 우선순위 높음
 *
 * @param base - 기본 컴포넌트 맵
 * @param additional - 추가할 컴포넌트 맵
 * @returns 병합된 컴포넌트 맵
 *
 * @example
 * ```ts
 * const merged = mergeComponents(
 *   { Image, Link },
 *   { CustomImage, CustomLink }
 * );
 * // CustomImage, CustomLink가 우선순위 높음
 * ```
 */
export function mergeComponents(
  base: Record<string, ComponentType<any>>,
  additional?: Record<string, ComponentType<any>>
): Record<string, ComponentType<any>> {
  if (!additional) return base;
  return {
    ...base,
    ...additional,
  };
}

