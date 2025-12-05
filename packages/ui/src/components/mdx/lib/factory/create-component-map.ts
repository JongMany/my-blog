import { useMemo } from "react";
import { Image, Link, Video } from "../components/base";
import type { ComponentMapOptions } from "../../types";
import type { ComponentType } from "react";
import { createElement } from "react";

/**
 * Factory Pattern: 컴포넌트 맵을 생성하는 팩토리 함수
 */
export function createMDXComponentMap(
  options: ComponentMapOptions
): Record<string, ComponentType<any>> {
  const { runtimeConfig, customComponents = {}, enableMermaid = false } = options;
  
  // 기본 컴포넌트들 (runtimeConfig 주입)
  const ImageWithConfig: ComponentType<any> = (props: any) => 
    createElement(Image, { ...props, runtimeConfig });
  const LinkWithConfig: ComponentType<any> = (props: any) => 
    createElement(Link, { ...props, runtimeConfig });
  
  const baseComponents: Record<string, ComponentType<any>> = {
    Image: ImageWithConfig,
    img: ImageWithConfig,
    Link: LinkWithConfig,
    Video: Video,
  };
  
  // 선택적 기능 (Mermaid) - 필요시 추가
  // if (enableMermaid) {
  //   baseComponents.Mermaid = Mermaid;
  // }
  
  // 커스텀 컴포넌트가 우선순위 높음 (덮어쓰기 가능)
  return {
    ...baseComponents,
    ...customComponents,
  };
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

