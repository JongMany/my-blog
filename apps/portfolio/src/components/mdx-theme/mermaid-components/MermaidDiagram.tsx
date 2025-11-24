import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  type MouseEvent,
  type WheelEvent,
} from "react";
import mermaid from "mermaid/dist/mermaid.esm.min.mjs";
import {
  normalizeMermaidCode,
  generateMermaidId,
  clampZoom,
  calculateMaxTranslate,
  clampTranslate,
  normalizeSize,
  calculateContainerWidth,
} from "./utils";

// ============================================================================
// Types
// ============================================================================

interface MermaidDiagramProps {
  children: ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
}

interface DragState {
  x: number;
  y: number;
}

interface TranslateState {
  x: number;
  y: number;
}

// ============================================================================
// Constants
// ============================================================================

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
  root: {
    fill: "#dbeafe",
    stroke: "#93c5fd",
    text: "#1e3a8a",
  },
  child: {
    fill: "#f0f9ff",
    stroke: "#a8d8ff",
    text: "#1e40af",
  },
  edge: {
    stroke: "#bfdbfe",
    strokeWidth: "2",
  },
} as const;

const ZOOM_CONFIG = {
  min: 0.1,
  max: 3,
  step: 1.2,
  wheelDelta: 0.1,
} as const;

const RENDER_DELAY_MS = 100;


// ============================================================================
// Mindmap Styling Functions
// ============================================================================

function applyMindmapNodeStyles(
  node: Element,
  index: number,
  isRoot: boolean,
): void {
  const colors = isRoot ? MINMAP_COLORS.root : MINMAP_COLORS.child;

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

  if (text) {
    text.setAttribute("fill", colors.text);
  }
}

function applyMindmapEdgeStyles(edge: Element): void {
  edge.setAttribute("stroke", MINMAP_COLORS.edge.stroke);
  edge.setAttribute("stroke-width", MINMAP_COLORS.edge.strokeWidth);
}

function applyMindmapStyleOverrides(styleElement: Element): void {
  const originalStyle = styleElement.textContent || "";
  const newStyle = originalStyle
    .replace(/fill:hsl\([^)]+\)/g, `fill:${MINMAP_COLORS.child.fill}`)
    .replace(/stroke:hsl\([^)]+\)/g, `stroke:${MINMAP_COLORS.edge.stroke}`)
    .replace(/fill:#2d3748/g, `fill:${MINMAP_COLORS.child.text}`);
  styleElement.textContent = newStyle;
}

function applyMindmapStyles(svgElement: SVGElement, mermaidCode: string): void {
  if (!mermaidCode.trim().startsWith("mindmap")) return;

  const nodes = svgElement.querySelectorAll("g.node");
  nodes.forEach((node, index) => {
    applyMindmapNodeStyles(node, index, index === 0);
  });

  const edges = svgElement.querySelectorAll("path.edge");
  edges.forEach(applyMindmapEdgeStyles);

  const styleElement = svgElement.querySelector("style");
  if (styleElement) {
    applyMindmapStyleOverrides(styleElement);
  }
}

// ============================================================================
// Component
// ============================================================================

export function MermaidDiagram({
  children,
  className = "",
  width,
  height,
}: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragState>({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<TranslateState>({ x: 0, y: 0 });

  const mermaidCode = useMemo(() => normalizeMermaidCode(children), [children]);

  // Mermaid 초기화 및 렌더링
  useEffect(() => {
    if (!ref.current) return;

    mermaid.initialize({
      startOnLoad: false,
      ...MERMAID_CONFIG,
    });

    const renderDiagram = async () => {
      if (!ref.current) return;

      try {
        const id = generateMermaidId();
        const { svg } = await mermaid.render(id, mermaidCode);

        if (!ref.current) return;

        ref.current.innerHTML = svg;

        const svgElement = ref.current.querySelector("svg");
        if (svgElement) {
          svgElement.style.cursor = "grab";
          svgElement.style.userSelect = "none";
          applyMindmapStyles(svgElement, mermaidCode);
        }
      } catch (error) {
        if (ref.current) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-500 rounded">Mermaid 다이어그램 렌더링 오류: ${errorMessage}</div>`;
        }
      }
    };

    const timer = setTimeout(renderDiagram, RENDER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [mermaidCode]);

  // 드래그 이벤트 처리
  const handleGlobalMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!isDragging) return;

      const container = ref.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const maxTranslateX = calculateMaxTranslate(containerRect.width, zoom);
      const maxTranslateY = calculateMaxTranslate(containerRect.height, zoom);

      const isZoomed = zoom > 1;
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newX = isZoomed
        ? clampTranslate(deltaX, maxTranslateX)
        : deltaX;
      const newY = isZoomed
        ? clampTranslate(deltaY, maxTranslateY)
        : deltaY;

      setTranslate({ x: newX, y: newY });
    },
    [isDragging, dragStart, zoom],
  );

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp]);

  // 키보드 이벤트 처리 (Ctrl/Meta 키 감지)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isModifierPressed = e.ctrlKey || e.metaKey;
    if (isModifierPressed) {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const isModifierReleased = !e.ctrlKey && !e.metaKey;
      if (isModifierReleased && !isDragging) {
        document.body.style.overflow = "";
      }
    },
    [isDragging],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown, handleKeyUp]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const isLeftButton = e.button === 0;
      if (!isLeftButton) return;

      setIsDragging(true);
      setDragStart({
        x: e.clientX - translate.x,
        y: e.clientY - translate.y,
      });
      document.body.style.overflow = "hidden";
    },
    [translate],
  );

  const handleWheel = useCallback((e: WheelEvent) => {
    const isModifierPressed = e.ctrlKey || e.metaKey;
    if (!isModifierPressed) return;

    e.preventDefault();

    const isScrollingDown = e.deltaY > 0;
    const delta = isScrollingDown
      ? 1 - ZOOM_CONFIG.wheelDelta
      : 1 + ZOOM_CONFIG.wheelDelta;

    setZoom((prev) =>
      clampZoom(prev * delta, ZOOM_CONFIG.min, ZOOM_CONFIG.max),
    );
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) =>
      clampZoom(prev * ZOOM_CONFIG.step, ZOOM_CONFIG.min, ZOOM_CONFIG.max),
    );
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) =>
      clampZoom(prev / ZOOM_CONFIG.step, ZOOM_CONFIG.min, ZOOM_CONFIG.max),
    );
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const transformStyle = useMemo(
    () => ({
      transform: `scale(${zoom}) translate(${translate.x / zoom}px, ${translate.y / zoom}px)`,
      transformOrigin: "center center",
      transition: isDragging ? "none" : "transform 0.1s ease-out",
    }),
    [zoom, translate, isDragging],
  );

  const cursorClass = isDragging ? "cursor-grabbing" : "cursor-grab";
  const containerWidth = useMemo(() => calculateContainerWidth(width), [width]);
  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      minHeight: normalizeSize(height, "300px"),
      maxHeight: normalizeSize(height, "800px"),
      width: "100%",
      overflow: "auto",
      scrollbarWidth: "none", // Firefox
      msOverflowStyle: "none", // IE/Edge
    }),
    [height],
  );

  return (
    <div className="relative" style={{ width: containerWidth }}>
      {/* 줌 컨트롤 버튼 */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-sm shadow-md cursor-pointer"
          title="줌인"
          type="button"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-sm shadow-md cursor-pointer"
          title="줌아웃"
          type="button"
        >
          -
        </button>
        <button
          onClick={handleReset}
          className="bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-sm shadow-md cursor-pointer"
          title="리셋"
          type="button"
        >
          ⌂
        </button>
      </div>

      {/* 다이어그램 컨테이너 */}
      <div
        className="relative border border-gray-200 rounded-lg bg-gray-50 [&::-webkit-scrollbar]:hidden"
        style={containerStyle}
      >
        <div
          ref={ref}
          className={`mermaid-diagram ${className} ${cursorClass}`}
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
          onWheel={handleWheel}
        />
      </div>

      {/* 사용법 안내 */}
      <div className="text-xs text-gray-500 text-center mt-2">
        Ctrl + 마우스 휠: 줌 | 드래그: 이동 | 버튼: 줌 컨트롤
      </div>
    </div>
  );
}
