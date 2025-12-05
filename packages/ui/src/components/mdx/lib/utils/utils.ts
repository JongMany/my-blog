import { createElement, ComponentType } from "react";

/**
 * 순수 함수: URL이 외부 링크인지 확인
 * MDX Link 컴포넌트에서 사용
 *
 * @param url - 확인할 URL 문자열
 * @returns 외부 링크인지 여부
 *
 * @example
 * ```ts
 * isExternalUrl("https://example.com"); // true
 * isExternalUrl("/blog/post"); // false
 * isExternalUrl("//example.com"); // true
 * ```
 */
export const isExternalUrl = (url?: string): boolean => {
  if (!url) return false;
  return /^https?:\/\//i.test(url) || url.startsWith("//");
};

/**
 * 고차 함수: 컴포넌트에 runtimeConfig를 주입하는 함수
 * MDX 컴포넌트 맵 생성 시 사용
 *
 * @param Component - runtimeConfig prop을 받는 컴포넌트
 * @param runtimeConfig - 주입할 런타임 설정
 * @returns runtimeConfig가 주입된 새로운 컴포넌트
 *
 * @example
 * ```ts
 * const ImageWithConfig = withRuntimeConfig(Image, runtimeConfig);
 * // ImageWithConfig는 이제 runtimeConfig를 자동으로 받음
 * ```
 */
export const withRuntimeConfig = <P extends { runtimeConfig: any }>(
  Component: ComponentType<P>,
  runtimeConfig: P["runtimeConfig"],
) => {
  return (props: Omit<P, "runtimeConfig">) => {
    return createElement(Component, { ...(props as P), runtimeConfig });
  };
};

