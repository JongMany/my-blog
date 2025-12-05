import { Link } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { Root, Element, Properties } from "hast";
import { visit } from "unist-util-visit";
import {
  isElement,
  isImageElement,
  isMermaidCodeBlock,
  extractClassName,
  extractMermaidCode,
} from "@/utils/hast";
import { isExternalUrl } from "@srf/ui";
import type { MDXRuntimeConfig, SerializeConfig } from "@srf/ui";
import { createDefaultSerializeConfig, RuntimeConfigBuilder, SerializeConfigBuilder } from "@srf/ui";

/**
 * 순수 함수: 이미지 소스 처리
 */
const processImageSource = (src: string, appName: string): string => {
  if (isExternalUrl(src)) return src;
  
  const isDevelopment = import.meta.env.MODE === "development";
  return imageSource(src, appName as "portfolio", { isDevelopment });
};

/**
 * Builder Pattern을 사용한 런타임 설정 생성
 */
export const portfolioRuntimeConfig: MDXRuntimeConfig = RuntimeConfigBuilder.create()
  .withLinkComponent(Link)
  .withImageSourceProcessor(processImageSource)
  .withAppName("portfolio")
  .build();

const MERMAID_DEFAULT_WIDTH = "min(600px, 100%)";

function rehypeUnwrapImages() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (
        node.tagName === "p" &&
        node.children.some(
          (child): child is Element => isElement(child) && isImageElement(child),
        )
      ) {
        node.tagName = "div";
      }
    });
  };
}

function rehypeSkipMermaid() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "pre") return;
      const codeChild = node.children.find(
        (child): child is Element => isElement(child) && child.tagName === "code",
      );
      if (!codeChild?.properties) return;
      const classStr = extractClassName(codeChild.properties.className);
      if (!isMermaidCodeBlock(classStr)) return;
      const mermaidCode = extractMermaidCode(codeChild.children);
      if (!mermaidCode) return;
      node.tagName = "div";
      const mermaidProperties: Properties = {
        "data-mermaid": "true",
        "data-mermaid-code": mermaidCode,
        "data-mermaid-width": MERMAID_DEFAULT_WIDTH,
        className: ["mermaid-wrapper"],
      };
      node.properties = mermaidProperties;
      node.children = [];
    });
  };
}

export function sanitizeMdxSource(src: string): string {
  return src
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/{{/g, "\\{\\{")
    .replace(/}}/g, "\\}\\}");
}

/**
 * Builder Pattern을 사용한 Serialize 설정 생성
 * 함수형 프로그래밍: 플러그인을 순차적으로 추가
 */
export const portfolioSerializeConfig: SerializeConfig = SerializeConfigBuilder.fromDefaults(
  createDefaultSerializeConfig()
)
  .addRemarkPlugin(remarkGfm)
  .addRehypePlugin(rehypeUnwrapImages)
  .addRehypePlugin(rehypeSkipMermaid)
  .addRehypePlugin(rehypePrettyCode, {
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
  })
  .withSanitizeSource(sanitizeMdxSource)
  .build();

