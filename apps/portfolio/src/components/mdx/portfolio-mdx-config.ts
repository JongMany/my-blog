import { Link } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import type { Element } from "hast";
import { isExternalLink, rehypeUnwrapImages, rehypeSkipMermaid } from "@srf/ui";
import type { RuntimeConfig, SerializeOptions, RehypePlugin } from "@srf/ui";
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

/**
 * MDX 소스 정제 함수
 * BOM 제거, 줄바꿈 정규화, 중괄호 이스케이프 처리
 */
export function sanitizeMdxSource(src: string): string {
  return src
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/{{/g, "\\{\\{")
    .replace(/}}/g, "\\}\\}");
}

/**
 * 플러그인 배열에서 특정 플러그인을 제거하는 유틸리티
 */
function removePlugin(
  plugins: RehypePlugin[],
  targetPlugin: unknown,
): RehypePlugin[] {
  return plugins.filter((plugin) => {
    if (Array.isArray(plugin)) {
      return plugin[0] !== targetPlugin;
    }
    return plugin !== targetPlugin;
  });
}

/**
 * rehypePrettyCode 설정
 */
const rehypePrettyCodeOptions = {
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
} as const;

/**
 * Serialize 옵션
 */
const defaultOptions = createDefaultSerializeOptions();
const baseRehypePlugins = removePlugin(
  defaultOptions.rehypePlugins ?? [],
  rehypePrettyCode,
);

export const portfolioSerializeOptions: SerializeOptions = {
  ...defaultOptions,
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    ...baseRehypePlugins,
    rehypeUnwrapImages,
    rehypeSkipMermaid,
    [rehypePrettyCode, rehypePrettyCodeOptions],
  ],
  sanitizeSource: sanitizeMdxSource,
};
