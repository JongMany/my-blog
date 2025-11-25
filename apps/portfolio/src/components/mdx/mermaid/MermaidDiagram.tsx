import {
  normalizeSize,
  calculateContainerWidth,
  calculateTransformStyle,
} from "./utils";
import { useMermaidRender } from "./useMermaidRender";
import { useDiagramZoom } from "./useDiagramZoom";
import { useDiagramDrag } from "./useDiagramDrag";
import type { MermaidDiagramProps } from "../types";

export function MermaidDiagram({
  children,
  className = "",
  width,
  height,
}: MermaidDiagramProps) {
  const ref = useMermaidRender(children);
  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleReset: resetZoom,
  } = useDiagramZoom(ref);
  const {
    isDragging,
    translate,
    handleMouseDown,
    handleReset: resetTranslate,
  } = useDiagramDrag(ref, zoom);

  const transformStyle = calculateTransformStyle(zoom, translate, isDragging);

  return (
    <div className="relative" style={{ width: calculateContainerWidth(width) }}>
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-sm shadow-md"
          title="줌인"
          type="button"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-sm shadow-md"
          title="줌아웃"
          type="button"
        >
          -
        </button>
        <button
          onClick={() => {
            resetZoom();
            resetTranslate();
          }}
          className="bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-sm shadow-md"
          title="리셋"
          type="button"
        >
          ⌂
        </button>
      </div>
      <div
        className="relative border border-gray-200 rounded-lg bg-gray-50 [&::-webkit-scrollbar]:hidden"
        style={{
          minHeight: normalizeSize(height, "300px"),
          maxHeight: normalizeSize(height, "800px"),
          width: "100%",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          ref={ref}
          className={`mermaid-diagram ${className} ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            padding: "20px",
            position: "relative",
            ...transformStyle,
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">
        Ctrl + 마우스 휠: 줌 | 드래그: 이동 | 버튼: 줌 컨트롤
      </div>
    </div>
  );
}
