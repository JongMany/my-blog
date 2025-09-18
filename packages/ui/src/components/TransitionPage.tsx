import React, { useRef, useEffect, ReactNode, HTMLAttributes } from "react";
import { useTransition } from "./TransitionProvider";
import { TransitionType, TransitionConfig } from "./TransitionProvider";

interface TransitionPageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TransitionPage({
  children,
  id,
  className = "",
  style = {},
  ...props
}: TransitionPageProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { registerPage, unregisterPage } = useTransition();

  useEffect(() => {
    if (elementRef.current) {
      registerPage(id, elementRef.current);
    }

    return () => {
      unregisterPage(id);
    };
  }, [id, registerPage, unregisterPage]);

  return (
    <div
      ref={elementRef}
      id={id}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// 페이지 전환을 위한 컨테이너 컴포넌트
interface TransitionContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TransitionContainer({
  children,
  className = "",
  style = {},
  ...props
}: TransitionContainerProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        minHeight: "100vh",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// 페이지 전환을 위한 라우터 훅
export function usePageTransition() {
  const { startTransition, state } = useTransition();

  const navigateTo = async (
    from: string,
    to: string,
    config?: TransitionConfig,
  ) => {
    await startTransition(from, to, config);
  };

  return {
    navigateTo,
    isTransitioning: state.isTransitioning,
    currentPage: state.currentPage,
    previousPage: state.previousPage,
  };
}

// 미리 정의된 전환 설정들
export const transitionPresets = {
  // 기본 페이드 전환
  fade: {
    type: "fade" as TransitionType,
    duration: 300,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // 슬라이드 전환들
  slideUp: {
    type: "slideUp" as TransitionType,
    duration: 400,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  slideDown: {
    type: "slideDown" as TransitionType,
    duration: 400,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  slideLeft: {
    type: "slideLeft" as TransitionType,
    duration: 400,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  slideRight: {
    type: "slideRight" as TransitionType,
    duration: 400,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // 스케일 전환
  scale: {
    type: "scale" as TransitionType,
    duration: 300,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // 빠른 전환
  quick: {
    type: "fade" as TransitionType,
    duration: 150,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // 느린 전환
  slow: {
    type: "fade" as TransitionType,
    duration: 600,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // 바운스 효과
  bounce: {
    type: "scale" as TransitionType,
    duration: 500,
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;
