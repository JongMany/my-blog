import { ReactNode } from "react";
import { MermaidDiagram } from "../mermaid/mermaid-diagram";
import { normalizeMermaidCode } from "../lib/utils";

interface MermaidProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  width?: string | number;
  height?: string | number;
}

export function Mermaid({ children, width, height, ...props }: MermaidProps) {
  return (
    <MermaidDiagram width={width} height={height} {...props}>
      {normalizeMermaidCode(children)}
    </MermaidDiagram>
  );
}
