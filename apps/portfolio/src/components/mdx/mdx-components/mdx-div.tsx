import React, { ReactNode } from "react";
import { MermaidDiagram } from "@/components/mdx/mermaid/mermaid-diagram";
import { isMermaid } from "./utils";
import type { MermaidDataAttributes } from "@/components/mdx/lib/types";

interface DivProps
  extends React.HTMLAttributes<HTMLDivElement>,
    MermaidDataAttributes {
  children?: ReactNode;
}

export function Div({ children, ...props }: DivProps) {
  const code = props["data-mermaid-code"];
  if (isMermaid(props) && code) {
    return (
      <MermaidDiagram
        width={props["data-mermaid-width"]}
        height={props["data-mermaid-height"]}
      >
        {code}
      </MermaidDiagram>
    );
  }
  return <div {...props}>{children}</div>;
}
