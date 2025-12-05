import { Link } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import { isExternalUrl } from "@srf/ui";
import type { MDXRuntimeConfig, SerializeConfig } from "@srf/ui";
import { createDefaultSerializeConfig } from "@srf/ui";

/**
 * 순수 함수: 이미지 소스 처리
 */
const processImageSource = (src: string, appName: string): string => {
  if (isExternalUrl(src)) return src;
  const isDevelopment = import.meta.env.MODE === "development";
  return imageSource(src, appName as "blog", { isDevelopment });
};

/**
 * 순수 함수: 런타임 설정 생성
 */
export const blogRuntimeConfig: MDXRuntimeConfig = {
  LinkComponent: Link,
  processImageSource,
  appName: "blog",
};

/**
 * 순수 함수: Serialize 설정 생성
 */
export const blogSerializeConfig: SerializeConfig = {
  ...createDefaultSerializeConfig(),
};

