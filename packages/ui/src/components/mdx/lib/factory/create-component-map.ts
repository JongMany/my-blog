import { useMemo } from "react";
import { Image, Link, Video } from "../components/base";
import type { ComponentMapOptions } from "../../types";
import type { ComponentType } from "react";
import { withRuntimeConfig } from "../utils/with-runtime-config";

/**
 * 기본 컴포넌트 맵 생성 (순수 함수)
 */
const createBaseComponentMap = (
  runtimeConfig: ComponentMapOptions["runtimeConfig"]
): Record<string, ComponentType<any>> => {
  // 고차 함수를 사용하여 runtimeConfig 주입
  const ImageWithConfig = withRuntimeConfig(Image, runtimeConfig);
  const LinkWithConfig = withRuntimeConfig(Link, runtimeConfig);

  return {
    Image: ImageWithConfig,
    img: ImageWithConfig,
    Link: LinkWithConfig,
    Video: Video,
  };
};

/**
 * 컴포넌트 맵 병합 (순수 함수, 불변성 보장)
 */
const mergeComponentMaps = (
  base: Record<string, ComponentType<any>>,
  custom: Record<string, ComponentType<any>> = {}
): Record<string, ComponentType<any>> => {
  return {
    ...base,
    ...custom, // 커스텀 컴포넌트가 우선순위 높음
  };
};

/**
 * Factory Pattern: 컴포넌트 맵을 생성하는 팩토리 함수
 * 함수형 프로그래밍: 함수 합성과 순수 함수 활용
 */
export function createMDXComponentMap(
  options: ComponentMapOptions
): Record<string, ComponentType<any>> {
  const { runtimeConfig, customComponents = {}, enableMermaid = false } = options;
  
  // 함수 합성: 기본 맵 생성 -> 병합
  const baseMap = createBaseComponentMap(runtimeConfig);
  
  // 선택적 기능 (Mermaid) - 필요시 추가
  // if (enableMermaid) {
  //   baseMap.Mermaid = Mermaid;
  // }
  
  return mergeComponentMaps(baseMap, customComponents);
}

/**
 * Hook 버전: 메모이제이션된 컴포넌트 맵
 */
export function useMDXComponentMap(options: ComponentMapOptions) {
  return useMemo(() => createMDXComponentMap(options), [
    options.runtimeConfig,
    options.customComponents,
    options.enableMermaid,
  ]);
}

