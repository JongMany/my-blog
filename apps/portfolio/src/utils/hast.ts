import type { Element, Text, Properties, ElementContent } from "hast";

/**
 * hast 노드 타입 가드 함수들
 */

export function isElement(node: ElementContent): node is Element {
  return node.type === "element";
}

export function isText(node: ElementContent): node is Text {
  return node.type === "text";
}

/**
 * 이미지 요소인지 확인하는 함수
 */
export function isImageElement(element: Element): boolean {
  return (
    element.tagName === "img" ||
    element.tagName === "Image" ||
    (element.properties && "src" in element.properties)
  );
}

/**
 * className 속성을 문자열로 변환하는 함수
 */
export function extractClassName(className: Properties["className"]): string {
  if (!className) return "";
  if (Array.isArray(className)) return className.join(" ");
  return String(className);
}

/**
 * mermaid 코드 블록인지 확인하는 함수
 */
export function isMermaidCodeBlock(className: string): boolean {
  return (
    className.includes("language-mermaid") || className.includes("mermaid")
  );
}

/**
 * ElementContent 배열에서 mermaid 코드를 추출하는 함수
 */
export function extractMermaidCode(children: ElementContent[]): string {
  return children
    .map((child) => {
      if (isText(child)) return child.value;
      return "";
    })
    .join("")
    .trim();
}

