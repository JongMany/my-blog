/**
 * 이미지 스타일 객체 생성
 */
export function createImageStyle(
  width?: number | string,
  height?: number | string,
): React.CSSProperties | undefined {
  if (!width && !height) return undefined;

  const style: React.CSSProperties = {};

  if (width) {
    const widthValue = typeof width === "number" ? `${width}px` : width;
    style.width = `min(${widthValue}, 100%)`;
  }

  if (height) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }

  return style;
}
