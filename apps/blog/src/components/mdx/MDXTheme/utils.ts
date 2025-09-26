import { assetUrl } from "@mfe/shared";

// 유틸리티 함수
export function fixAssetSrc(src?: string): string | undefined {
  if (!src) return src;
  if (src.startsWith("/_blog/") || src.startsWith("_blog/")) {
    return assetUrl(src.replace(/^\//, ""), "blog");
  }
  if (!/^https?:\/\//i.test(src) && !src.startsWith("/")) {
    return assetUrl(`_blog/${src}`, "blog");
  }
  return src;
}
