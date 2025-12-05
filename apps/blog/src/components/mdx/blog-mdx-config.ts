import { Link } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import { isExternalLink } from "@srf/ui";
import type { RuntimeConfig, SerializeOptions } from "@srf/ui";
import { createDefaultSerializeOptions } from "@srf/ui";

/**
 * 이미지 소스 처리
 */
function processImageSource(src: string, appName: string): string {
  if (isExternalLink(src)) return src;
  const isDevelopment = import.meta.env.MODE === "development";
  return imageSource(src, appName as "blog", { isDevelopment });
}

/**
 * 런타임 설정
 */
export const blogRuntimeConfig: RuntimeConfig = {
  processImageSource,
  appName: "blog",
};

/**
 * 링크 컴포넌트
 */
export const blogLinkComponent = Link;

/**
 * Serialize 옵션
 */
export const blogSerializeOptions: SerializeOptions = {
  ...createDefaultSerializeOptions(),
};

