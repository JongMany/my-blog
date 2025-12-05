import { useMemo } from "react";
import { Image, Link, Video } from "../components/base";
import type {
  ComponentMapConfig,
  ComponentMap,
  RuntimeConfig,
} from "../../types";
import { injectRuntimeConfig } from "../utils";

/**
 * 기본 컴포넌트 맵 생성
 */
function createDefaultComponents(runtime: RuntimeConfig): ComponentMap {
  return {
    Image: injectRuntimeConfig(Image, runtime),
    img: injectRuntimeConfig(Image, runtime),
    Link: injectRuntimeConfig(Link, runtime),
    Video: Video,
  };
}

/**
 * 컴포넌트 맵 생성
 */
export function createComponentMap(config: ComponentMapConfig): ComponentMap {
  const defaults = createDefaultComponents(config.runtime);
  return { ...defaults, ...(config.custom ?? {}) };
}

/**
 * 메모이제이션된 컴포넌트 맵 훅
 */
export function useComponentMap(config: ComponentMapConfig) {
  return useMemo(
    () => createComponentMap(config),
    [
      config.runtime.LinkComponent,
      config.runtime.processImageSource,
      config.runtime.appName,
      config.custom,
    ],
  );
}
