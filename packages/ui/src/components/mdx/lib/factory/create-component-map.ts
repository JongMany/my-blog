import { useMemo } from "react";
import { Image, Link, Video } from "../components/base";
import type { ComponentMapOptions } from "../../types";
import type { ComponentType } from "react";
import { withRuntimeConfig } from "../utils";

/**
 * 순수 함수: 기본 컴포넌트 맵 생성
 */
const createBaseComponentMap = (
  runtimeConfig: ComponentMapOptions["runtimeConfig"],
): Record<string, ComponentType<any>> => ({
  Image: withRuntimeConfig(Image, runtimeConfig),
  img: withRuntimeConfig(Image, runtimeConfig),
  Link: withRuntimeConfig(Link, runtimeConfig),
  Video: Video,
});

/**
 * 순수 함수: 컴포넌트 맵 생성
 */
export function createMDXComponentMap(
  options: ComponentMapOptions,
): Record<string, ComponentType<any>> {
  const { runtimeConfig, customComponents = {} } = options;
  const baseMap = createBaseComponentMap(runtimeConfig);
  return {
    ...baseMap,
    ...customComponents,
  };
}

/**
 * Hook: 메모이제이션된 컴포넌트 맵
 */
export function useMDXComponentMap(options: ComponentMapOptions) {
  return useMemo(
    () => createMDXComponentMap(options),
    // 객체 참조 동일성 문제를 피하기 위해 개별 속성 사용
    [
      options.runtimeConfig.LinkComponent,
      options.runtimeConfig.processImageSource,
      options.runtimeConfig.appName,
      options.customComponents,
    ],
  );
}
