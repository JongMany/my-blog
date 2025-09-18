import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";

// 전환 효과 타입 정의
export type TransitionType =
  | "fade"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "none";

// 전환 설정 인터페이스
export interface TransitionConfig {
  type: TransitionType;
  duration?: number;
  delay?: number;
  easing?: string;
}

// 전환 상태 인터페이스
interface TransitionState {
  isTransitioning: boolean;
  currentPage: string | null;
  previousPage: string | null;
}

// 전환 컨텍스트 타입
interface TransitionContextType {
  state: TransitionState;
  startTransition: (
    from: string,
    to: string,
    config?: TransitionConfig,
  ) => Promise<void>;
  registerPage: (id: string, element: HTMLElement) => void;
  unregisterPage: (id: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined,
);

// 기본 전환 설정
const defaultConfig: TransitionConfig = {
  type: "fade",
  duration: 300,
  delay: 0,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
};

// 전환 효과 함수들
const transitionEffects = {
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
      element.style.transform = "translateY(100%)";
      element.style.transition = `transform ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "translateY(0)";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}`;
      element.style.transform = "translateY(-100%)";
    },
  },
  slideDown: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transform = "translateY(-100%)";
      element.style.transition = `transform ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "translateY(0)";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}`;
      element.style.transform = "translateY(100%)";
    },
  },
  slideLeft: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transform = "translateX(100%)";
      element.style.transition = `transform ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "translateX(0)";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}`;
      element.style.transform = "translateX(-100%)";
    },
  },
  slideRight: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transform = "translateX(-100%)";
      element.style.transition = `transform ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "translateX(0)";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}`;
      element.style.transform = "translateX(100%)";
    },
  },
  scale: {
    enter: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transform = "scale(0.8)";
      element.style.opacity = "0";
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      requestAnimationFrame(() => {
        element.style.transform = "scale(1)";
        element.style.opacity = "1";
      });
    },
    exit: (element: HTMLElement, duration: number, easing: string) => {
      element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      element.style.transform = "scale(1.2)";
      element.style.opacity = "0";
    },
  },
  none: {
    enter: () => {},
    exit: () => {},
  },
};

interface TransitionProviderProps {
  children: ReactNode;
  defaultTransition?: TransitionConfig;
}

export function TransitionProvider({
  children,
  defaultTransition = defaultConfig,
}: TransitionProviderProps) {
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    currentPage: null,
    previousPage: null,
  });

  const pagesRef = useRef<Map<string, HTMLElement>>(new Map());
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  // 페이지 등록/해제
  const registerPage = (id: string, element: HTMLElement) => {
    pagesRef.current.set(id, element);
  };

  const unregisterPage = (id: string) => {
    pagesRef.current.delete(id);
  };

  // 전환 시작
  const startTransition = async (
    from: string,
    to: string,
    config: TransitionConfig = defaultTransition,
  ): Promise<void> => {
    if (state.isTransitioning) return;

    const fromElement = pagesRef.current.get(from);
    const toElement = pagesRef.current.get(to);

    if (!fromElement || !toElement) {
      console.warn(`Transition elements not found: from=${from}, to=${to}`);
      return;
    }

    setState((prev) => ({
      ...prev,
      isTransitioning: true,
      previousPage: from,
    }));

    const effect = transitionEffects[config.type];
    const duration = config.duration || defaultConfig.duration!;
    const easing = config.easing || defaultConfig.easing!;

    // Exit 애니메이션
    effect.exit(fromElement, duration, easing);

    // Enter 애니메이션 (약간의 지연 후)
    setTimeout(() => {
      effect.enter(toElement, duration, easing);
    }, config.delay || 0);

    // 전환 완료 대기
    return new Promise((resolve) => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(
        () => {
          setState((prev) => ({
            ...prev,
            isTransitioning: false,
            currentPage: to,
          }));
          resolve();
        },
        duration + (config.delay || 0),
      );
    });
  };

  // 정리
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const value: TransitionContextType = {
    state,
    startTransition,
    registerPage,
    unregisterPage,
  };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

// 훅
export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
