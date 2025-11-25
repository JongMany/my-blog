import React, { ReactNode, Children, isValidElement } from "react";
import { MermaidDiagram } from "../mermaid/MermaidDiagram";
import { normalizeClassName, extractTextFromChildren } from "../lib/utils";
import { isMermaid } from "./utils";
import { CODE_BLOCK_STYLES } from "./constants";
import type {
  CodeElementProps,
  MermaidDataAttributes,
} from "../lib/types";

interface PreProps
  extends React.HTMLAttributes<HTMLPreElement>,
    MermaidDataAttributes {
  children?: ReactNode;
}

export function Pre({ children, className, ...props }: PreProps) {
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
  
  // mermaid가 아닌 경우 rehype-pretty-code가 적용된 스타일을 유지
  // rehype-pretty-code가 추가한 data-theme, className 등을 그대로 전달
  // data-theme이 있는 경우 rehype-pretty-code가 생성한 코드 블록이므로
  // prose의 기본 스타일을 오버라이드하기 위해 추가 클래스 적용
  const hasPrettyCode = props["data-theme"] !== undefined;
  const baseClassName = normalizeClassName(className);
  const combinedClassName = hasPrettyCode
    ? `${baseClassName} ${CODE_BLOCK_STYLES.prettyCode}`.trim()
    : baseClassName;
  
  return (
    <pre className={combinedClassName} {...props}>
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
  // prose 클래스가 자동으로 스타일을 적용하도록 커스텀 스타일 제거
  return <code {...props} className={className}>{children}</code>;
}


