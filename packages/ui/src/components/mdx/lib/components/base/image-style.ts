/**
 * 순수 함수: 숫자를 CSS 값으로 변환
 */
const toCssValue = (value: number | string): string => {
  return typeof value === "number" ? `${value}px` : value;
};

/**
 * 순수 함수: width 스타일 생성
 */
const createWidthStyle = (width?: number | string): string | undefined => {
  return width ? `min(${toCssValue(width)}, 100%)` : undefined;
};

/**
 * 순수 함수: height 스타일 생성
 */
const createHeightStyle = (height?: number | string): string | undefined => {
  return height ? toCssValue(height) : undefined;
};

/**
 * 순수 함수: 이미지 스타일 객체 생성
 * 함수형 프로그래밍: 작은 순수 함수들을 조합
 */
export const createImageStyle = (
  width?: number | string,
  height?: number | string
): React.CSSProperties | undefined => {
  const widthStyle = createWidthStyle(width);
  const heightStyle = createHeightStyle(height);
  
  if (!widthStyle && !heightStyle) return undefined;
  
  return {
    ...(widthStyle && { width: widthStyle }),
    ...(heightStyle && { height: heightStyle }),
  };
};

