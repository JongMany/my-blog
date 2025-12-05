import React, { useMemo, createElement } from "react";
import { Image, Link as BaseLink, Video } from "../components/base";
import type { ComponentMapConfig, ComponentMap } from "../../types";
import { injectRuntimeConfig } from "../utils";

/**
 * 기본 컴포넌트 맵 생성
 */
function createDefaultComponents(config: ComponentMapConfig): ComponentMap {
  const { runtime } = config;

  return {
    Image: injectRuntimeConfig(Image, runtime),
    img: injectRuntimeConfig(Image, runtime),
    Link: BaseLink,
    a: BaseLink, // MDX에서 <a> 태그도 Link 컴포넌트로 렌더링
    Video: Video,
  };
}

/**
 * 컴포넌트 맵 생성
 */
export function createComponentMap(config: ComponentMapConfig): ComponentMap {
  const defaults = createDefaultComponents(config);
  return { ...defaults, ...(config.custom ?? {}) };
}

/**
 * 메모이제이션된 컴포넌트 맵 훅
 */
export function useComponentMap(config: ComponentMapConfig) {
  return useMemo(
    () => createComponentMap(config),
    [
      config.linkComponent,
      config.runtime.processImageSource,
      config.runtime.appName,
      config.custom,
    ],
  );
}
