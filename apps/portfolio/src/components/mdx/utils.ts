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
  return imageSource(src, "portfolio", {
    isDevelopment: import.meta.env.MODE === "development",
  });
}

export function createImageStyle(width?: number | string, height?: number | string): React.CSSProperties | undefined {
  if (!width && !height) return undefined;
  return {
    ...(width && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height && { height: typeof height === "number" ? `${height}px` : height }),
  };
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

