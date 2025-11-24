import { useEffect, useRef } from "react";
import mermaid from "mermaid/dist/mermaid.esm.min.mjs";
import { generateMermaidId, normalizeMermaidCode } from "./utils";
import type { ReactNode } from "react";

const MERMAID_CONFIG = {
  theme: "base" as const,
  themeVariables: {
    primaryColor: "#a8d8ff",
    primaryTextColor: "#2d3748",
    primaryBorderColor: "#90cdf4",
    background: "#ffffff",
    mainBkg: "#ffffff",
    secondBkg: "#f7fafc",
    tertiaryBkg: "#edf2f7",
    secondaryTextColor: "#4a5568",
    lineColor: "#e2e8f0",
    secondaryColor: "#f7fafc",
    tertiaryColor: "#e2e8f0",
    nodeBkg: "#ffffff",
    nodeBorder: "#e2e8f0",
    clusterBkg: "#f7fafc",
    clusterBorder: "#e2e8f0",
    accent1: "#a8d8ff",
    accent2: "#a7f3d0",
    accent3: "#fecaca",
    accent4: "#fef3c7",
    accent5: "#ddd6fe",
    accent6: "#fce7f3",
    accent7: "#d1fae5",
  },
  flowchart: {
    nodeSpacing: 80,
    rankSpacing: 80,
    curve: "basis" as const,
    padding: 30,
    htmlLabels: true,
  },
  mindmap: {
    padding: 40,
    maxNodeWidth: 200,
  },
} as const;

const MINMAP_COLORS = {
  root: { fill: "#dbeafe", stroke: "#93c5fd", text: "#1e3a8a" },
  child: { fill: "#f0f9ff", stroke: "#a8d8ff", text: "#1e40af" },
  edge: { stroke: "#bfdbfe", strokeWidth: "2" },
} as const;

function applyMindmapStyles(svgElement: SVGElement, mermaidCode: string): void {
  if (!mermaidCode.trim().startsWith("mindmap")) return;

  svgElement.querySelectorAll("g.node").forEach((node, index) => {
    const colors = index === 0 ? MINMAP_COLORS.root : MINMAP_COLORS.child;
    const path = node.querySelector("path");
    const circle = node.querySelector("circle");
    const text = node.querySelector("text");
    if (path) {
      path.setAttribute("fill", colors.fill);
      path.setAttribute("stroke", colors.stroke);
    }
    if (circle) {
      circle.setAttribute("fill", colors.fill);
      circle.setAttribute("stroke", colors.stroke);
    }
    if (text) text.setAttribute("fill", colors.text);
  });

  svgElement.querySelectorAll("path.edge").forEach((edge) => {
    edge.setAttribute("stroke", MINMAP_COLORS.edge.stroke);
    edge.setAttribute("stroke-width", MINMAP_COLORS.edge.strokeWidth);
  });

  const style = svgElement.querySelector("style");
  if (style) {
    const content = style.textContent || "";
    style.textContent = content
      .replace(/fill:hsl\([^)]+\)/g, `fill:${MINMAP_COLORS.child.fill}`)
      .replace(/stroke:hsl\([^)]+\)/g, `stroke:${MINMAP_COLORS.edge.stroke}`)
      .replace(/fill:#2d3748/g, `fill:${MINMAP_COLORS.child.text}`);
  }
}

export function useMermaidRender(children: ReactNode) {
  const ref = useRef<HTMLDivElement>(null);
  const mermaidCode = normalizeMermaidCode(children);

  useEffect(() => {
    if (!ref.current) return;
    mermaid.initialize({ startOnLoad: false, ...MERMAID_CONFIG });

    const render = async () => {
      if (!ref.current) return;
      try {
        const { svg } = await mermaid.render(generateMermaidId(), mermaidCode);
        if (!ref.current) return;
        ref.current.innerHTML = svg;
        const svgEl = ref.current.querySelector("svg");
        if (svgEl) {
          svgEl.style.cursor = "grab";
          svgEl.style.userSelect = "none";
          applyMindmapStyles(svgEl, mermaidCode);
        }
      } catch (error) {
        if (ref.current) {
          const msg = error instanceof Error ? error.message : String(error);
          ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-500 rounded">Mermaid 다이어그램 렌더링 오류: ${msg}</div>`;
        }
      }
    };

    const timer = setTimeout(render, 100);
    return () => clearTimeout(timer);
  }, [mermaidCode]);

  return ref;
}

