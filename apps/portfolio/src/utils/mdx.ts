import type { ReactNode } from "react";
import { isValidElement } from "react";
import { imageSource } from "@mfe/shared";

/**
 * MDX 컴포넌트에서 사용하는 유틸리티 함수들
 */

/**
 * className을 문자열로 정규화하는 함수
 */
export function normalizeClassName(className?: string | string[]): string {
  if (!className) return "";
  if (Array.isArray(className)) return className.join(" ");
  return className;
}

/**
 * 외부 URL인지 확인하는 함수
 */
export function isExternalUrl(url?: string): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url) || url.startsWith("//");
}

/**
 * 이미지 소스를 처리하는 함수
 */
export function processImageSource(src?: string): string | undefined {
  if (!src) return undefined;
  if (isExternalUrl(src)) return src;
  return imageSource(src, "portfolio", {
    isDevelopment: import.meta.env.MODE === "development",
  });
}

/**
 * 이미지 스타일을 생성하는 함수
 */
export function createImageStyle(
  width?: number | string,
  height?: number | string,
): React.CSSProperties | undefined {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;
  return Object.keys(style).length > 0 ? style : undefined;
}

/**
 * ReactNode에서 텍스트를 추출하는 함수
 */
interface ElementWithChildren {
  children?: ReactNode;
  src?: string;
  alt?: string;
}

export function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (isValidElement(children)) {
    const childProps = children.props as ElementWithChildren;
    if (childProps?.children) {
      return extractTextFromChildren(childProps.children);
    }
  }
  return "";
}

/**
 * mermaid 코드를 정규화하는 함수
 */
export function normalizeMermaidCode(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.join("");
  return String(children);
}

