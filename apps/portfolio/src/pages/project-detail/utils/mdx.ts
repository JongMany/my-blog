import { serialize } from "next-mdx-remote/serialize";
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
} from "../../../utils/hast";

/**
 * 이미지가 포함된 p 태그를 div로 변환하는 rehype 플러그인
 * p 태그 안에 img가 있으면 p 태그를 div로 변환 (HTML 중첩 오류 방지)
 */
function rehypeUnwrapImages() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "p") {
        const hasImage = node.children.some(
          (child): child is Element =>
            isElement(child) && isImageElement(child),
        );

        if (hasImage) {
          node.tagName = "div";
        }
      }
    });
  };
}

/**
 * mermaid 코드 블록을 감지하고 특별한 속성을 추가하는 rehype 플러그인
 * rehypePrettyCode 전에 실행되어야 함
 */
function rehypeSkipMermaid() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "pre") return;

      const codeChild = node.children.find(
        (child): child is Element =>
          isElement(child) && child.tagName === "code",
      );

      if (!codeChild?.properties) return;

      const classStr = extractClassName(codeChild.properties.className);
      if (!isMermaidCodeBlock(classStr)) return;

      const mermaidCode = extractMermaidCode(codeChild.children);
      if (!mermaidCode) return;

      node.tagName = "div";
      node.properties = {
        "data-mermaid": "true",
        "data-mermaid-code": mermaidCode,
                "data-mermaid-width": "min(600px, 100%)",
        className: ["mermaid-wrapper"],
      } as Properties;
      node.children = [];
    });
  };
}

/**
 * MDX 소스 코드를 정리하는 순수함수
 */
export function sanitizeMdxSource(src: string): string {
  return src
    .replace(/^\uFEFF/, "") // BOM 제거
    .replace(/\r\n/g, "\n") // CRLF → LF
    .replace(/{{/g, "\\{\\{") // 템플릿 더블 중괄호 방어
    .replace(/}}/g, "\\}\\}");
}

/**
 * MDX 소스를 serialize하여 next-mdx-remote에서 사용할 수 있는 형태로 변환
 */
export async function serializeMdx(source: string) {
  const sanitizedSource = sanitizeMdxSource(source);
  return await serialize(sanitizedSource, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: {
              className: ["anchor"],
              ariaLabel: "anchor",
            },
          },
        ],
        // 이미지가 포함된 p 태그 분리 (가장 먼저 실행)
        rehypeUnwrapImages,
        // mermaid 감지 및 마킹 (rehypePrettyCode 전에 실행)
        rehypeSkipMermaid,
        [
          rehypePrettyCode,
          {
            theme: "dark-plus",
            filterMetaString: (string: string) =>
              string.replace(/filename="[^"]*"/, ""),
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
    },
  });
}
