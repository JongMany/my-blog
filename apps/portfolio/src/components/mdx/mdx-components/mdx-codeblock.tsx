import React, { ReactNode, Children, isValidElement } from "react";
import { MermaidDiagram } from "@/components/mdx/mermaid/mermaid-diagram";
import { normalizeClassName, extractTextFromChildren } from "@/components/mdx/lib/utils";
import { isMermaid } from "./utils";
import { CODE_BLOCK_STYLES } from "@/components/mdx/constants/styles";
import type { CodeElementProps, MermaidDataAttributes } from "@/components/mdx/lib/types";

interface PreProps
  extends React.HTMLAttributes<HTMLPreElement>,
    MermaidDataAttributes {
  children?: ReactNode;
}

/**
 * code 요소에서 mermaid 관련 속성을 추출하고 병합
 */
function getMermaidCheckProps(
  codeProps: CodeElementProps,
  preProps: MermaidDataAttributes,
): MermaidDataAttributes & { className?: string | string[] } {
  return {
    className: codeProps.className,
    "data-language": codeProps["data-language"] ?? preProps["data-language"],
    "data-lang": codeProps["data-lang"] ?? preProps["data-lang"],
    "data-skip-pretty-code":
      codeProps["data-skip-pretty-code"] ?? preProps["data-skip-pretty-code"],
    "data-mermaid": preProps["data-mermaid"],
  };
}

/**
 * React 요소가 code 요소인지 확인하고 CodeElementProps로 타입 가드
 */
function isCodeElement(
  element: React.ReactElement,
): element is React.ReactElement<CodeElementProps> {
  return element.type === "code";
}

/**
 * children에서 첫 번째 code 요소를 찾아 반환
 */
function findFirstCodeElement(
  children: ReactNode,
): { codeProps: CodeElementProps; codeChildren: ReactNode } | null {
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child) || !isCodeElement(child)) continue;
    const codeProps = child.props;
    return { codeProps, codeChildren: codeProps.children };
  }
  return null;
}

export function Pre({ children, className, ...props }: PreProps) {
  // code 요소 찾기
  const codeElement = findFirstCodeElement(children);

  // mermaid 체크 및 렌더링
  if (codeElement) {
    const mermaidCheckProps = getMermaidCheckProps(
      codeElement.codeProps,
      props,
    );
    if (isMermaid(mermaidCheckProps)) {
      const text = extractTextFromChildren(codeElement.codeChildren);
      if (text.trim()) {
        return <MermaidDiagram>{text}</MermaidDiagram>;
      }
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
  // mermaid 체크는 Pre 컴포넌트에서 처리되므로 여기서는 단순 렌더링
  return (
    <code {...props} className={className}>
      {children}
    </code>
  );
}
