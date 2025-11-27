import { ReactNode, Children, isValidElement } from "react";
import { normalizeClassName, hasElementWithChildrenProps } from "../lib/utils";
import type { MermaidDataAttributes } from "../lib/types";

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

