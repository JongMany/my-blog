import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * mermaid 코드 블록을 감지하고 특별한 속성을 추가하는 rehype 플러그인
 * rehypePrettyCode 전에 실행되어야 함
 */
function rehypeSkipMermaid() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      // pre > code 구조에서 mermaid 감지
      if (node.tagName === "pre" && parent) {
        const codeChild = node.children.find(
          (child: any) => child.type === "element" && child.tagName === "code",
        ) as any;
        if (codeChild && codeChild.type === "element" && codeChild.properties) {
          const className = codeChild.properties.className;
          const classStr = Array.isArray(className)
            ? className.join(" ")
            : String(className || "");
          if (
            classStr.includes("language-mermaid") ||
            classStr.includes("mermaid")
          ) {
            // mermaid 코드 내용 추출
            const mermaidCode = codeChild.children
              .map((child: any) => {
                if (child.type === "text") return child.value;
                return "";
              })
              .join("")
              .trim();

            if (mermaidCode) {
              // pre 태그를 특별한 div로 변환
              node.tagName = "div";
              node.properties = {
                "data-mermaid": "true",
                "data-mermaid-code": mermaidCode,
                className: ["mermaid-wrapper"],
              };
              node.children = [];
            }
          }
        }
      }
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
        // mermaid 감지 및 마킹 (rehypePrettyCode 전에 실행)
        rehypeSkipMermaid,
        [
          rehypePrettyCode,
          {
            theme: "dark-plus",
            filterMetaString: (string: string) =>
              string.replace(/filename="[^"]*"/, ""),
            onVisitHighlightedLine(node: any) {
              node.properties.className.push("highlighted");
            },
            onVisitHighlightedWord(node: any) {
              node.properties.className = ["word"];
            },
          },
        ],
      ],
    },
  });
}
