import type React from "react";
import type { ReactNode } from "react";

export interface MermaidDataAttributes {
  "data-mermaid"?: string;
  "data-mermaid-code"?: string;
  "data-mermaid-width"?: string;
  "data-mermaid-height"?: string;
  "data-language"?: string;
  "data-lang"?: string;
  "data-skip-pretty-code"?: string;
}

export interface CodeElementProps {
  className?: string | string[];
  children?: ReactNode;
  "data-language"?: string;
  "data-lang"?: string;
  "data-skip-pretty-code"?: string;
}

export interface ElementWithChildren {
  children?: ReactNode;
  src?: string;
  alt?: string;
}

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  source?: string;
  description?: string;
  width?: number | string;
  height?: number | string;
};

export interface MermaidDiagramProps {
  children: ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export interface DragState {
  x: number;
  y: number;
}

export interface TranslateState {
  x: number;
  y: number;
}

export type FrontmatterData = Record<string, unknown>;

