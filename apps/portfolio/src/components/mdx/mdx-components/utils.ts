import { ReactNode, Children, isValidElement } from "react";
import { normalizeClassName } from "../lib/utils";
import type { ElementWithChildren, MermaidDataAttributes } from "../lib/types";

export function isMermaid(
  props: MermaidDataAttributes & { className?: string | string[] },
): boolean {
  if (
    props["data-mermaid"] === "true" ||
    props["data-skip-pretty-code"] === "true"
  )
    return true;
  const cls = normalizeClassName(props.className);
  const lang = props["data-language"] || props["data-lang"] || "";
  return cls.includes("mermaid") || lang === "mermaid";
}

/**
 * React 요소가 ElementWithChildren을 가진 요소인지 확인하는 타입 가드
 */
function hasElementWithChildrenProps(
  props: unknown,
): props is ElementWithChildren {
  return (
    typeof props === "object" &&
    props !== null &&
    ("children" in props || "src" in props || "alt" in props)
  );
}

export function hasImage(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    const type = child.type;
    if (!hasElementWithChildrenProps(child.props)) return false;
    const props = child.props;
    if (
      type === "img" ||
      (typeof type === "string" && type.toLowerCase().includes("image")) ||
      props.src
    )
      return true;
    return props.children ? hasImage(props.children) : false;
  });
}


