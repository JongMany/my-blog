import React, { ReactNode, Children, isValidElement } from "react";
import { MermaidDiagram } from "../mermaid/MermaidDiagram";
import { normalizeClassName, extractTextFromChildren } from "../lib/utils";
import { isMermaid } from "./utils";
import type {
  CodeElementProps,
  MermaidDataAttributes,
} from "../lib/types";

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
  // prose 클래스가 자동으로 스타일을 적용하도록 커스텀 스타일 제거
  return <pre {...props}>{children}</pre>;
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
  // prose 클래스가 자동으로 스타일을 적용하도록 커스텀 스타일 제거
  return <code {...props} className={className}>{children}</code>;
}


