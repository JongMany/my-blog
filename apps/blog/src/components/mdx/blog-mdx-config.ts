import { Link } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import { isExternalUrl } from "@srf/ui";
import type { MDXRuntimeConfig, SerializeConfig } from "@srf/ui";
import { createDefaultSerializeConfig, RuntimeConfigBuilder, SerializeConfigBuilder } from "@srf/ui";

/**
 * 순수 함수: 이미지 소스 처리
 */
const processImageSource = (src: string, appName: string): string => {
  if (isExternalUrl(src)) return src;
  
  const isDevelopment = import.meta.env.MODE === "development";
  return imageSource(src, appName as "blog", { isDevelopment });
};

/**
 * Builder Pattern을 사용한 런타임 설정 생성
 */
export const blogRuntimeConfig: MDXRuntimeConfig = RuntimeConfigBuilder.create()
  .withLinkComponent(Link)
  .withImageSourceProcessor(processImageSource)
  .withAppName("blog")
  .build();

/**
 * Builder Pattern을 사용한 Serialize 설정 생성
 */
export const blogSerializeConfig: SerializeConfig = SerializeConfigBuilder.fromDefaults(
  createDefaultSerializeConfig()
).build();

