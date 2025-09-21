import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface SimpleMermaidProps {
  children: string;
}

export function SimpleMermaid({ children }: SimpleMermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Mermaid 초기화
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
    });

    // 다이어그램 렌더링
    const renderDiagram = async () => {
      try {
        const id = `simple-mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, children);
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (error) {
        if (ref.current) {
          ref.current.innerHTML = `<div style="color: red; padding: 20px; border: 1px solid red;">Mermaid 오류: ${error}</div>`;
        }
      }
    };

    renderDiagram();
  }, [children]);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        border: "2px solid blue",
        margin: "20px 0",
      }}
    >
      <div>Mermaid 로딩 중...</div>
    </div>
  );
}
