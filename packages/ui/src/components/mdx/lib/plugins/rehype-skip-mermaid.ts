import type { Root, Element, Properties, ElementContent } from "hast";
import { visit } from "unist-util-visit";

const MERMAID_DEFAULT_WIDTH = "min(600px, 100%)";

/**
 * 요소인지 확인하는 함수
 */
function isElement(node: unknown): node is Element {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    (node as { type: string }).type === "element"
  );
}

/**
 * className 속성을 문자열로 변환하는 함수
 */
function extractClassName(className: Properties["className"]): string {
  if (!className) return "";
  if (Array.isArray(className)) return className.join(" ");
  return String(className);
}

/**
 * mermaid 코드 블록인지 확인하는 함수
 */
function isMermaidCodeBlock(className: string): boolean {
  return (
    className.includes("language-mermaid") || className.includes("mermaid")
  );
}

/**
 * ElementContent 배열에서 mermaid 코드를 추출하는 함수
 */
function extractMermaidCode(children: ElementContent[]): string {
  return children
    .map((child) => {
      if (child.type === "text") return child.value;
      return "";
    })
    .join("")
    .trim();
}

/**
 * rehypeSkipMermaid 플러그인
 * Mermaid 코드 블록을 <div>로 변환하여 별도 처리합니다.
 */
export function rehypeSkipMermaid() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;
      const codeChild = node.children.find(
        (child: ElementContent): child is Element => isElement(child) && child.tagName === "code",
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

