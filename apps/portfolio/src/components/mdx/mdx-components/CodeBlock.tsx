import React, { ReactNode, Children, isValidElement } from "react";
import { cn } from "@srf/ui";
import { MermaidDiagram } from "../mermaid/MermaidDiagram";
import { normalizeClassName, extractTextFromChildren } from "../utils";
import { CODE_BLOCK_STYLES, CODE_INLINE_STYLE, CODE_BLOCK_STYLE } from "./constants";
import { isMermaid } from "./utils";
import type {
  CodeElementProps,
  MermaidDataAttributes,
} from "../types";

interface PreProps
  extends React.HTMLAttributes<HTMLPreElement>,
    MermaidDataAttributes {
  children?: ReactNode;
}

export function Pre({ children, ...props }: PreProps) {
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child) || child.type !== "code") continue;
    const cp = child.props as CodeElementProps;
    if (
      isMermaid({
        className: cp?.className,
        "data-language": cp?.["data-language"] || props["data-language"],
        "data-lang": cp?.["data-lang"] || props["data-lang"],
        "data-skip-pretty-code":
          cp?.["data-skip-pretty-code"] || props["data-skip-pretty-code"],
      })
    ) {
      const text = extractTextFromChildren(cp?.children || "");
      if (text.trim()) return <MermaidDiagram>{text}</MermaidDiagram>;
    }
  }
  const hasCode = Children.toArray(children).some(
    (c) =>
      isValidElement(c) &&
      (c.type === "code" ||
        normalizeClassName((c.props as CodeElementProps)?.className).includes(
          "language-",
        )),
  );
  return (
    <pre
      {...props}
      className={cn(
        hasCode ? CODE_BLOCK_STYLES.prettyCode : CODE_BLOCK_STYLES.default,
        props.className,
      )}
    >
      {children}
    </pre>
  );
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  "data-language"?: string;
  "data-lang"?: string;
}

export function Code({ children, className, ...props }: CodeProps) {
  if (isMermaid({ className, ...props }))
    return (
      <code {...props} className={className}>
        {children}
      </code>
    );
  const inline = !normalizeClassName(className).includes("language-");
  return (
    <code
      {...props}
      className={cn(inline ? CODE_INLINE_STYLE : CODE_BLOCK_STYLE, className)}
    >
      {children}
    </code>
  );
}


