import React from "react";

export interface BlurGradientProps {
  /**
   * 블러 강도 (0-100)
   * 큰 값(10 이상)은 성능에 영향을 줄 수 있습니다.
   */
  blur?: number;
  /**
   * 테두리 반지름
   */
  borderRadius?: number;
  /**
   * 그라디언트 방향
   */
  direction?: "toBottom" | "toTop" | "toLeft" | "toRight";
  /**
   * 추가 CSS 클래스명
   */
  className?: string;
  /**
   * 추가 스타일
   */
  style?: React.CSSProperties;
}

/**
 * 블러 그라디언트 효과를 제공하는 컴포넌트
 * 여러 레이어의 블러 효과를 조합하여 부드러운 그라디언트 효과를 만듭니다.
 */
export const BlurGradient: React.FC<BlurGradientProps> = ({
  blur = 10,
  borderRadius = 0,
  direction = "toBottom",
  className,
  style,
}) => {
  const getDirectionValue = (dir: string): string => {
    switch (dir) {
      case "toBottom":
      default:
        return "to bottom";
      case "toTop":
        return "to top";
      case "toLeft":
        return "to left";
      case "toRight":
        return "to right";
    }
  };

  // 블러 레이어 정의
  const blurLayers = [
    {
      blur: `${blur / 2 / 2 / 2 / 2 / 2 / 2 / 2}px`,
      gradient:
        "rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 0) 37.5%",
    },
    {
      blur: `${blur / 2 / 2 / 2 / 2 / 2 / 2}px`,
      gradient:
        "rgba(0, 0, 0, 0) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(0, 0, 0, 0) 50%",
    },
    {
      blur: `${blur / 2 / 2 / 2 / 2 / 2}px`,
      gradient:
        "rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 62.5%",
    },
    {
      blur: `${blur / 2 / 2 / 2 / 2}px`,
      gradient:
        "rgba(0, 0, 0, 0) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(0, 0, 0, 0) 75%",
    },
    {
      blur: `${blur / 2 / 2 / 2}px`,
      gradient:
        "rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 87.5%",
    },
    {
      blur: `${blur / 2 / 2}px`,
      gradient:
        "rgba(0, 0, 0, 0) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 0) 100%",
    },
    {
      blur: `${blur / 2}px`,
      gradient:
        "rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 1) 100%",
    },
    {
      blur: `${blur}px`,
      gradient: "rgba(0, 0, 0, 0) 87.5%, rgba(0, 0, 0, 1) 100%",
    },
  ];

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: `${borderRadius}px`,
        ...style,
      }}
    >
      {blurLayers.map((layer, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: index + 1,
            backdropFilter: `blur(${layer.blur})`,
            WebkitBackdropFilter: `blur(${layer.blur})`,
            maskImage: `linear-gradient(${getDirectionValue(direction)}, ${layer.gradient})`,
            WebkitMaskImage: `linear-gradient(${getDirectionValue(direction)}, ${layer.gradient})`,
            borderRadius: `${borderRadius}px`,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
};

BlurGradient.displayName = "BlurGradient";
