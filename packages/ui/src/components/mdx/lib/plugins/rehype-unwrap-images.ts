import type { Root, Element, ElementContent } from "hast";
import { visit } from "unist-util-visit";

/**
 * 이미지 요소인지 확인하는 함수
 */
function isImageElement(element: Element): boolean {
  return (
    element.tagName === "img" ||
    element.tagName === "Image" ||
    (element.properties && "src" in element.properties)
  );
}

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
 * rehypeUnwrapImages 플러그인
 * 이미지를 포함한 <p> 태그를 <div>로 변환합니다.
 */
export function rehypeUnwrapImages() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (
        node.tagName === "p" &&
        node.children.some(
          (child: ElementContent): child is Element => isElement(child) && isImageElement(child),
        )
      ) {
        node.tagName = "div";
      }
    });
  };
}

