import { createElement, ComponentType } from "react";

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

