import type { ReactNode } from "react";
import { isValidElement } from "react";
import { portfolioRuntimeConfig } from "../portfolio-mdx-config";
import type { ElementWithChildren } from "./types";

export function normalizeClassName(className?: string | string[]): string {
  if (!className) return "";
  return Array.isArray(className) ? className.join(" ") : className;
}

export function isExternalUrl(url?: string): boolean {
  return url ? /^https?:\/\//i.test(url) || url.startsWith("//") : false;
}

/**
 * 이미지 소스 처리 함수
 * RuntimeConfig의 processImageSource를 사용하여 일관성 유지
 */
export function processImageSource(src?: string): string | undefined {
  if (!src) return undefined;
  return portfolioRuntimeConfig.processImageSource(
    src,
    portfolioRuntimeConfig.appName,
  );
}

export function createImageStyle(width?: number | string, height?: number | string): React.CSSProperties | undefined {
  if (!width && !height) return undefined;
  
  const style: React.CSSProperties = {};
  
  if (width) {
    // width가 지정되면 min(width, 100%)로 처리
    const widthValue = typeof width === "number" ? `${width}px` : width;
    style.width = `min(${widthValue}, 100%)`;
  }
  
  if (height) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }
  
  return style;
}

/**
 * React 요소가 ElementWithChildren을 가진 요소인지 확인하는 타입 가드
 */
export function hasElementWithChildrenProps(
  props: unknown,
): props is ElementWithChildren {
  return (
    typeof props === "object" &&
    props !== null &&
    ("children" in props || "src" in props || "alt" in props)
  );
}

export function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join("");
  if (isValidElement(children)) {
    if (hasElementWithChildrenProps(children.props)) {
      return children.props.children
        ? extractTextFromChildren(children.props.children)
        : "";
    }
  }
  return "";
}

export function normalizeMermaidCode(children: ReactNode): string {
  if (typeof children === "string") return children;
  return Array.isArray(children) ? children.join("") : String(children);
}

