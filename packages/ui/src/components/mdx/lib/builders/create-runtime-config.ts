import type { ComponentType, ReactNode } from "react";
import type { MDXRuntimeConfig } from "../../types";

/**
 * 순수 함수: MDXRuntimeConfig 생성
 */
export function createRuntimeConfig(
  config: MDXRuntimeConfig
): MDXRuntimeConfig {
  return {
    LinkComponent: config.LinkComponent,
    processImageSource: config.processImageSource,
    appName: config.appName,
  };
}

