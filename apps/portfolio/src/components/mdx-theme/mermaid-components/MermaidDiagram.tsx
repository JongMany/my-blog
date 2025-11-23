import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid/dist/mermaid.esm.min.mjs";

interface MermaidDiagramProps {
  children: React.ReactNode;
  className?: string;
}

export function MermaidDiagram({
  children,
  className = "",
}: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ref.current) return;

    // children을 문자열로 변환
    const mermaidCode =
      typeof children === "string"
        ? children
        : Array.isArray(children)
          ? children.join("")
          : String(children);

    // Mermaid 초기화 - 파스텔톤 스타일
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        // 파스텔 메인 컬러
        primaryColor: "#a8d8ff",
        primaryTextColor: "#2d3748",
        primaryBorderColor: "#90cdf4",

        // 배경색
        background: "#ffffff",
        mainBkg: "#ffffff",
        secondBkg: "#f7fafc",
        tertiaryBkg: "#edf2f7",

        // 텍스트 색상
        secondaryTextColor: "#4a5568",

        // 라인 색상
        lineColor: "#e2e8f0",
        secondaryColor: "#f7fafc",
        tertiaryColor: "#e2e8f0",

        // 노드 색상
        nodeBkg: "#ffffff",
        nodeBorder: "#e2e8f0",
        clusterBkg: "#f7fafc",
        clusterBorder: "#e2e8f0",

        // 파스텔 액센트 컬러
        accent1: "#a8d8ff", // 파스텔 블루
        accent2: "#a7f3d0", // 파스텔 그린
        accent3: "#fecaca", // 파스텔 레드
        accent4: "#fef3c7", // 파스텔 옐로우
        accent5: "#ddd6fe", // 파스텔 퍼플
        accent6: "#fce7f3", // 파스텔 핑크
        accent7: "#d1fae5", // 파스텔 민트
      },
      flowchart: {
        nodeSpacing: 80,
        rankSpacing: 80,
        curve: "basis",
        padding: 30,
        htmlLabels: true,
      },
      mindmap: {
        padding: 40,
        maxNodeWidth: 200,
      },
    });

    // 다이어그램 렌더링
    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, mermaidCode);
        if (ref.current) {
          ref.current.innerHTML = svg;

          // 줌 컨트롤 추가
          const svgElement = ref.current.querySelector("svg");
          if (svgElement) {
            svgElement.style.cursor = "grab";
            svgElement.style.userSelect = "none";

            // 마인드맵인 경우 파스텔 색상 적용
            if (mermaidCode.trim().startsWith("mindmap")) {
              // 모든 노드에 파스텔 색상 적용
              const nodes = svgElement.querySelectorAll("g.node");
              nodes.forEach((node, index) => {
                const path = node.querySelector("path");
                const circle = node.querySelector("circle");
                const text = node.querySelector("text");

                if (path) {
                  // 루트 노드 (첫 번째 노드)
                  if (index === 0) {
                    path.setAttribute("fill", "#dbeafe"); // 파스텔 블루
                    path.setAttribute("stroke", "#93c5fd"); // 파스텔 블루 테두리
                  } else {
                    path.setAttribute("fill", "#f0f9ff"); // 연한 파스텔 블루
                    path.setAttribute("stroke", "#a8d8ff"); // 파스텔 블루 테두리
                  }
                }

                if (circle) {
                  if (index === 0) {
                    circle.setAttribute("fill", "#dbeafe"); // 파스텔 블루
                    circle.setAttribute("stroke", "#93c5fd"); // 파스텔 블루 테두리
                  } else {
                    circle.setAttribute("fill", "#f0f9ff"); // 연한 파스텔 블루
                    circle.setAttribute("stroke", "#a8d8ff"); // 파스텔 블루 테두리
                  }
                }

                if (text) {
                  if (index === 0) {
                    text.setAttribute("fill", "#1e3a8a"); // 진한 파스텔 블루 텍스트
                  } else {
                    text.setAttribute("fill", "#1e40af"); // 진한 파스텔 블루 텍스트
                  }
                }
              });

              // 연결선에 파스텔 색상 적용
              const paths = svgElement.querySelectorAll("path.edge");
              paths.forEach((path) => {
                path.setAttribute("stroke", "#bfdbfe"); // 파스텔 블루 라인
                path.setAttribute("stroke-width", "2");
              });

              // 인라인 스타일도 오버라이드
              const styleElement = svgElement.querySelector("style");
              if (styleElement) {
                const originalStyle = styleElement.textContent || "";
                const newStyle = originalStyle
                  .replace(/fill:hsl\([^)]+\)/g, "fill:#f0f9ff")
                  .replace(/stroke:hsl\([^)]+\)/g, "stroke:#bfdbfe")
                  .replace(/fill:#2d3748/g, "fill:#1e40af");
                styleElement.textContent = newStyle;
              }
            }
          }
        }
      } catch (error) {
        if (ref.current) {
          ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-500 rounded">Mermaid 다이어그램 렌더링 오류: ${error}</div>`;
        }
      }
    };

    // 약간의 지연을 두고 렌더링
    const timer = setTimeout(renderDiagram, 100);
    return () => clearTimeout(timer);
  }, [children]);

  // 전역 마우스 이벤트 처리
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      // 컨테이너 크기 계산
      const container = ref.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // 줌이 1보다 클 때만 이동 제한 적용
      if (zoom > 1) {
        // 줌에 따른 최대 이동 거리 계산
        const maxTranslateX = (containerWidth * (zoom - 1)) / 2;
        const maxTranslateY = (containerHeight * (zoom - 1)) / 2;

        // 이동 거리를 제한
        const newX = Math.max(
          -maxTranslateX,
          Math.min(maxTranslateX, e.clientX - dragStart.x),
        );
        const newY = Math.max(
          -maxTranslateY,
          Math.min(maxTranslateY, e.clientY - dragStart.y),
        );

        setTranslate({ x: newX, y: newY });
      } else {
        // 줌이 1 이하일 때도 드래그는 가능하지만 이동 범위 제한
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setTranslate({ x: newX, y: newY });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      // 드래그 종료 시 페이지 스크롤 복원
      document.body.style.overflow = "";
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, zoom]);

  // Ctrl 키 상태 감지 및 스크롤 제어
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        document.body.style.overflow = "hidden";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey && !isDragging) {
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.body.style.overflow = "";
    };
  }, [isDragging]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    // 마우스 왼쪽 버튼만 드래그 허용
    if (e.button !== 0) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });

    // 드래그 중에는 페이지 스크롤 방지
    document.body.style.overflow = "hidden";
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Ctrl 키를 누르고 있을 때만 줌 작동
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)));
    }
    // Ctrl 없이 휠 스크롤은 페이지 스크롤로 동작 (하지만 Ctrl이 눌려있으면 이미 스크롤이 차단됨)
  };

  const resetView = () => {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };

  return (
    <div className="relative">
      {/* 줌 컨트롤 버튼 */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={() => setZoom((prev) => Math.min(3, prev * 1.2))}
          className="bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-sm shadow-md"
          title="줌인"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(0.1, prev * 0.8))}
          className="bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-sm shadow-md"
          title="줌아웃"
        >
          -
        </button>
        <button
          onClick={resetView}
          className="bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded text-sm shadow-md"
          title="리셋"
        >
          ⌂
        </button>
      </div>

      {/* 다이어그램 컨테이너 */}
      <div
        className="relative border border-gray-200 rounded-lg bg-gray-50"
        style={{
          minHeight: "300px",
          maxHeight: "800px",
          overflow: "auto",
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
            transform: `scale(${zoom}) translate(${translate.x / zoom}px, ${translate.y / zoom}px)`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
            position: "relative",
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
