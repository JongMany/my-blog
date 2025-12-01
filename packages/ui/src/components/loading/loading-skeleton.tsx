import { useMemo } from "react";

interface LoadingSkeletonProps {
  /**
   * 스켈레톤의 너비
   * @default "100%"
   */
  width?: string | number;
  /**
   * 스켈레톤의 높이
   * @default "1em"
   */
  height?: string | number;
  /**
   * 라인 수 (여러 줄 스켈레톤)
   * @default 1
   */
  lines?: number;
  /**
   * 라인 간격
   * @default "0.5rem"
   */
  gap?: string;
  /**
   * 마지막 라인의 너비 (일반적으로 마지막 줄이 짧음)
   * @default "80%"
   */
  lastLineWidth?: string | number;
  /**
   * border-radius 값
   * @default "0.25rem"
   */
  borderRadius?: string;
  /**
   * 추가 클래스명
   */
  className?: string;
}

export default function LoadingSkeleton({
  width = "100%",
  height = "1em",
  lines = 1,
  gap = "0.5rem",
  lastLineWidth = "80%",
  borderRadius = "0.25rem",
  className = "",
}: LoadingSkeletonProps) {
  const lineWidths = useMemo(() => {
    if (lines === 1) return [width];
    return Array.from({ length: lines - 1 }, () => width).concat([
      lastLineWidth,
    ]);
  }, [lines, width, lastLineWidth]);

  return (
    <div className={`flex flex-col ${className}`} style={{ gap }}>
      {lineWidths.map((lineWidth, index) => (
        <div
          key={index}
          className="skeleton-shimmer rounded bg-gray-300 dark:bg-gray-700"
          style={{
            width: lineWidth,
            height,
            borderRadius,
          }}
        />
      ))}
    </div>
  );
}
