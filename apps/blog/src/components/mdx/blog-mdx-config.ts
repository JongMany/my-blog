import { Link } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import type { MDXRuntimeConfig, SerializeConfig } from "@srf/ui";
import { createDefaultSerializeConfig } from "@srf/ui";

export const blogRuntimeConfig: MDXRuntimeConfig = {
  LinkComponent: Link,
  processImageSource: (src: string) => {
    const isExternalUrl = /^https?:\/\//i.test(src);
    if (isExternalUrl) return src;
    
    const isDevelopment = import.meta.env.MODE === "development";
    return imageSource(src, "blog", { isDevelopment });
  },
  appName: "blog",
};

export const blogSerializeConfig: SerializeConfig = {
  ...createDefaultSerializeConfig(),
  // blog 특화 설정이 필요하면 여기에 추가
};

