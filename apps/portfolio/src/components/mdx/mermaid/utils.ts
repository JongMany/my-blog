/**
 * Mermaid 다이어그램 관련 유틸리티 함수들
 */

/**
 * 고유한 mermaid ID를 생성하는 함수
 */
export function generateMermaidId(): string {
  return `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * 줌 값을 제한하는 함수
 */
export function clampZoom(zoom: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, zoom));
}

/**
 * 최대 translate 값을 계산하는 함수
 */
export function calculateMaxTranslate(
  containerSize: number,
  zoom: number,
): number {
  return (containerSize * (zoom - 1)) / 2;
}

/**
 * translate 값을 제한하는 함수
 */
export function clampTranslate(value: number, max: number): number {
  return Math.max(-max, Math.min(max, value));
}

/**
 * 크기 값을 정규화하는 함수
 */
export function normalizeSize(
  size: string | number | undefined,
  defaultValue: string,
): string {
  if (!size) return defaultValue;
  return typeof size === "number" ? `${size}px` : size;
}

/**
 * 컨테이너 너비를 계산하는 함수
 */
export function calculateContainerWidth(
  width: string | number | undefined,
): string {
  if (!width) return "min(600px, 100%)";
  return typeof width === "number" ? `${width}px` : width;
}

/**
 * 다이어그램 transform 스타일을 계산하는 함수
 */
export function calculateTransformStyle(
  zoom: number,
  translate: { x: number; y: number },
  isDragging: boolean,
): React.CSSProperties {
  return {
    transform: `scale(${zoom}) translate(${translate.x / zoom}px, ${translate.y / zoom}px)`,
    transformOrigin: "center center",
    transition: isDragging ? "none" : "transform 0.1s ease-out",
  };
}

