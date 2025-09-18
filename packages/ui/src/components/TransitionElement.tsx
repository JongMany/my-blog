import React, {
  useRef,
  useEffect,
  useState,
  ReactNode,
  HTMLAttributes,
} from "react";
import { TransitionType, TransitionConfig } from "./TransitionProvider";

// 개별 요소 애니메이션 설정
interface ElementTransitionConfig {
  in?: TransitionType;
  out?: TransitionType;
  duration?: number;
  delay?: number;
  easing?: string;
  trigger?: "mount" | "unmount" | "both";
}

interface TransitionElementProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  id?: string;
  config?: ElementTransitionConfig;
  className?: string;
  style?: React.CSSProperties;
}

// 요소별 전환 효과 함수들
const elementTransitionEffects = {
  fade: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.opacity = "0";
      element.style.transition = `opacity ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.opacity = "1";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `opacity ${duration}ms ${easing}`;
      element.style.opacity = "0";
    },
  },
  slideUp: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transform = "translateY(20px)";
      element.style.opacity = "0";
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "translateY(0)";
        element.style.opacity = "1";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      element.style.transform = "translateY(-20px)";
      element.style.opacity = "0";
    },
  },
  slideDown: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transform = "translateY(-20px)";
      element.style.opacity = "0";
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "translateY(0)";
        element.style.opacity = "1";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      element.style.transform = "translateY(20px)";
      element.style.opacity = "0";
    },
  },
  slideLeft: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transform = "translateX(20px)";
      element.style.opacity = "0";
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "translateX(0)";
        element.style.opacity = "1";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      element.style.transform = "translateX(-20px)";
      element.style.opacity = "0";
    },
  },
  slideRight: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transform = "translateX(-20px)";
      element.style.opacity = "0";
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "translateX(0)";
        element.style.opacity = "1";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      element.style.transform = "translateX(20px)";
      element.style.opacity = "0";
    },
  },
  scale: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transform = "scale(0.9)";
      element.style.opacity = "0";
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "scale(1)";
        element.style.opacity = "1";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      element.style.transform = "scale(1.1)";
      element.style.opacity = "0";
    },
  },
  none: {
    enter: () => {},
    exit: () => {},
  },
};

export function TransitionElement({
  children,
  id,
  config = {},
  className = "",
  style = {},
  ...props
}: TransitionElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const {
    in: enterTransition = "fade",
    out: exitTransition = "fade",
    duration = 300,
    delay = 0,
    easing = "cubic-bezier(0.4, 0, 0.2, 1)",
    trigger = "both",
  } = config;

  // 마운트 시 애니메이션
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    if (trigger === "mount" || trigger === "both") {
      const effect = elementTransitionEffects[enterTransition];
      if (effect && effect.enter) {
        setTimeout(() => {
          effect.enter(element, duration, easing);
        }, delay);
      }
    }
  }, [enterTransition, duration, delay, easing, trigger]);

  // 언마운트 시 애니메이션
  const handleUnmount = () => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    if (trigger === "unmount" || trigger === "both") {
      const effect = elementTransitionEffects[exitTransition];
      if (effect && effect.exit) {
        effect.exit(element, duration, easing);

        // 애니메이션 완료 후 렌더링 중단
        setTimeout(() => {
          setShouldRender(false);
        }, duration);
      } else {
        setShouldRender(false);
      }
    } else {
      setShouldRender(false);
    }
  };

  // 외부에서 언마운트 제어를 위한 메서드 노출
  useEffect(() => {
    if (elementRef.current) {
      (elementRef.current as any).unmount = handleUnmount;
    }
  }, [exitTransition, duration, easing, trigger]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={elementRef}
      id={id}
      className={className}
      style={{
        ...style,
        // 초기 상태 설정
        opacity:
          enterTransition === "fade" || enterTransition === "scale" ? "0" : "1",
        transform:
          enterTransition === "scale"
            ? "scale(0.9)"
            : enterTransition === "slideUp"
              ? "translateY(20px)"
              : enterTransition === "slideDown"
                ? "translateY(-20px)"
                : enterTransition === "slideLeft"
                  ? "translateX(20px)"
                  : enterTransition === "slideRight"
                    ? "translateX(-20px)"
                    : "none",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// 편의를 위한 개별 컴포넌트들
export function FadeIn({
  children,
  ...props
}: Omit<TransitionElementProps, "config">) {
  return (
    <TransitionElement config={{ in: "fade" }} {...props}>
      {children}
    </TransitionElement>
  );
}

export function SlideUp({
  children,
  ...props
}: Omit<TransitionElementProps, "config">) {
  return (
    <TransitionElement config={{ in: "slideUp" }} {...props}>
      {children}
    </TransitionElement>
  );
}

export function SlideDown({
  children,
  ...props
}: Omit<TransitionElementProps, "config">) {
  return (
    <TransitionElement config={{ in: "slideDown" }} {...props}>
      {children}
    </TransitionElement>
  );
}

export function SlideLeft({
  children,
  ...props
}: Omit<TransitionElementProps, "config">) {
  return (
    <TransitionElement config={{ in: "slideLeft" }} {...props}>
      {children}
    </TransitionElement>
  );
}

export function SlideRight({
  children,
  ...props
}: Omit<TransitionElementProps, "config">) {
  return (
    <TransitionElement config={{ in: "slideRight" }} {...props}>
      {children}
    </TransitionElement>
  );
}

export function ScaleIn({
  children,
  ...props
}: Omit<TransitionElementProps, "config">) {
  return (
    <TransitionElement config={{ in: "scale" }} {...props}>
      {children}
    </TransitionElement>
  );
}
