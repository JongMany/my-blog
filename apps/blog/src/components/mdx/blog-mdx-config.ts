import { Link } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import { isExternalUrl } from "@srf/ui";
import type { MDXRuntimeConfig, SerializeConfig } from "@srf/ui";
import { createDefaultSerializeConfig, createRuntimeConfig, mergeSerializeConfig } from "@srf/ui";

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
export const blogRuntimeConfig: MDXRuntimeConfig = createRuntimeConfig({
  LinkComponent: Link,
  processImageSource,
  appName: "blog",
});

/**
 * 순수 함수: Serialize 설정 생성
 * portfolio와 일관성을 위해 mergeSerializeConfig 사용
 */
export const blogSerializeConfig: SerializeConfig = mergeSerializeConfig(
  createDefaultSerializeConfig(),
  {
    // blog는 기본 설정만 사용 (추가 플러그인 없음)
  }
);

