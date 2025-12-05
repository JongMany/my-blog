import { Link } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import type { Element } from "hast";
import { isExternalLink, rehypeUnwrapImages, rehypeSkipMermaid } from "@srf/ui";
import type { RuntimeConfig, SerializeOptions } from "@srf/ui";
import { createDefaultSerializeOptions } from "@srf/ui";

/**
 * 이미지 소스 처리
 */
function processImageSource(src: string, appName: string): string {
  if (isExternalLink(src)) return src;
  
  const isDevelopment = import.meta.env.MODE === "development";
  return imageSource(src, appName as "portfolio", { isDevelopment });
}

/**
 * 런타임 설정
 */
export const portfolioRuntimeConfig: RuntimeConfig = {
  processImageSource,
  appName: "portfolio",
};

/**
 * 링크 컴포넌트
 */
export const portfolioLinkComponent = Link;

export function sanitizeMdxSource(src: string): string {
  return src
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/{{/g, "\\{\\{")
    .replace(/}}/g, "\\}\\}");
}

/**
 * Serialize 옵션
 */
const defaultOptions = createDefaultSerializeOptions();
// 기본 rehypePlugins에서 rehypePrettyCode를 제거하고 새로운 설정으로 교체
const baseRehypePlugins = (defaultOptions.rehypePlugins ?? []).filter(
  (plugin) => {
    // rehypePrettyCode 플러그인 제거 (튜플 형태 또는 함수 형태 모두 체크)
    if (Array.isArray(plugin)) {
      return plugin[0] !== rehypePrettyCode;
    }
    return plugin !== rehypePrettyCode;
  },
);

export const portfolioSerializeOptions: SerializeOptions = {
  ...defaultOptions,
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    ...baseRehypePlugins,
    rehypeUnwrapImages,
    rehypeSkipMermaid,
    [
      rehypePrettyCode,
      {
        theme: "dark-plus",
        filterMetaString: (string: string) => string.replace(/filename="[^"]*"/, ""),
        onVisitHighlightedLine(node: Element) {
          if (node.properties && Array.isArray(node.properties.className)) {
            node.properties.className.push("highlighted");
          }
        },
        onVisitHighlightedWord(node: Element) {
          node.properties.className = ["word"];
        },
      },
    ],
  ],
  sanitizeSource: sanitizeMdxSource,
};

