import { useRef, useEffect, useState, useCallback } from "react";

// 애니메이션 상태 타입
export type AnimationState = "idle" | "running" | "paused" | "finished";

// 애니메이션 설정 인터페이스
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  iterations?: number | "infinite";
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  fillMode?: "none" | "forwards" | "backwards" | "both";
}

// 애니메이션 훅 반환 타입
export interface UseAnimationReturn {
  state: AnimationState;
  play: () => void;
  pause: () => void;
  reverse: () => void;
  finish: () => void;
  cancel: () => void;
  reset: () => void;
}

// 기본 애니메이션 설정
const defaultConfig: Required<AnimationConfig> = {
  duration: 300,
  delay: 0,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  iterations: 1,
  direction: "normal",
  fillMode: "forwards",
};

// 애니메이션 훅
export function useAnimation(
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  config: AnimationConfig = {},
): UseAnimationReturn {
  const elementRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const [state, setState] = useState<AnimationState>("idle");

  const mergedConfig = { ...defaultConfig, ...config };

  // 애니메이션 실행
  const play = useCallback(() => {
    if (!elementRef.current) return;

    const animation = elementRef.current.animate(keyframes, {
      duration: mergedConfig.duration,
      delay: mergedConfig.delay,
      easing: mergedConfig.easing,
      iterations: mergedConfig.iterations,
      direction: mergedConfig.direction,
      fill: mergedConfig.fillMode,
    });

    animationRef.current = animation;
    setState("running");

    animation.addEventListener("finish", () => {
      setState("finished");
    });

    animation.addEventListener("cancel", () => {
      setState("idle");
    });
  }, [keyframes, mergedConfig]);

  // 애니메이션 일시정지
  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
      setState("paused");
    }
  }, []);

  // 애니메이션 역방향 실행
  const reverse = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.reverse();
    }
  }, []);

  // 애니메이션 즉시 완료
  const finish = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.finish();
      setState("finished");
    }
  }, []);

  // 애니메이션 취소
  const cancel = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
      setState("idle");
    }
  }, []);

  // 애니메이션 리셋
  const reset = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
    }
    setState("idle");
  }, []);

  // 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, []);

  return {
    state,
    play,
    pause,
    reverse,
    finish,
    cancel,
    reset,
  };
}

// 스크롤 기반 애니메이션 훅
export function useScrollAnimation(
  threshold: number = 0.1,
  rootMargin: string = "0px",
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  return { elementRef, isVisible };
}

// 마우스 호버 애니메이션 훅
export function useHoverAnimation(
  hoverKeyframes: Keyframe[] | PropertyIndexedKeyframes,
  leaveKeyframes: Keyframe[] | PropertyIndexedKeyframes,
  config: AnimationConfig = {},
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { play: playHover, cancel: cancelHover } = useAnimation(
    hoverKeyframes,
    config,
  );
  const { play: playLeave, cancel: cancelLeave } = useAnimation(
    leaveKeyframes,
    config,
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    cancelLeave();
    playHover();
  }, [cancelLeave, playHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    cancelHover();
    playLeave();
  }, [cancelHover, playLeave]);

  return {
    elementRef,
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
  };
}

// 시퀀스 애니메이션 훅
export function useSequenceAnimation(
  animations: Array<{
    keyframes: Keyframe[] | PropertyIndexedKeyframes;
    config?: AnimationConfig;
    delay?: number;
  }>,
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const playSequence = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setCurrentIndex(0);

    for (let i = 0; i < animations.length; i++) {
      setCurrentIndex(i);

      const { keyframes, config = {}, delay = 0 } = animations[i];

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if (elementRef.current) {
        const animation = elementRef.current.animate(keyframes, {
          duration: config.duration || 300,
          easing: config.easing || "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: config.fillMode || "forwards",
        });

        await animation.finished;
      }
    }

    setIsRunning(false);
  }, [animations, isRunning]);

  return {
    elementRef,
    currentIndex,
    isRunning,
    playSequence,
  };
}
