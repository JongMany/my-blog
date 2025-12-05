import { createElement, ComponentType } from "react";

/**
 * 외부 링크 여부 확인
 */
export function isExternalLink(url?: string): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url) || url.startsWith("//");
}

/**
 * 컴포넌트에 런타임 설정 주입
 */
export function injectRuntimeConfig<P extends { runtimeConfig: unknown }>(
  Component: ComponentType<P>,
  runtime: P["runtimeConfig"]
) {
  return (props: Omit<P, "runtimeConfig">) => {
    return createElement(Component, { ...(props as P), runtimeConfig: runtime });
  };
}

