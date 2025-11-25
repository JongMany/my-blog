import type { ReactNode } from "react";
import { isValidElement } from "react";
import { imageSource } from "@mfe/shared";
import type { ElementWithChildren } from "./types";

export function normalizeClassName(className?: string | string[]): string {
  if (!className) return "";
  return Array.isArray(className) ? className.join(" ") : className;
}

export function isExternalUrl(url?: string): boolean {
  return url ? /^https?:\/\//i.test(url) || url.startsWith("//") : false;
}

export function processImageSource(src?: string): string | undefined {
  if (!src) return undefined;
  if (isExternalUrl(src)) return src;

  // 프로덕션 모드에서는 Vite의 base 경로가 이미 처리되므로 원본 경로를 그대로 사용
  const isDevelopment = import.meta.env.MODE === "development";
  if (!isDevelopment) {
    return src;
  }

  // 개발 모드에서만 imageSource를 사용하여 localhost URL을 붙임
  return imageSource(src, "portfolio", {
    isDevelopment: true,
  });
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

export function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join("");
  if (isValidElement(children)) {
    const props = children.props as ElementWithChildren;
    return props?.children ? extractTextFromChildren(props.children) : "";
  }
  return "";
}

export function normalizeMermaidCode(children: ReactNode): string {
  if (typeof children === "string") return children;
  return Array.isArray(children) ? children.join("") : String(children);
}

