// 애니메이션 유틸리티 함수들

// 이징 함수들
export const easing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",

  // 커스텀 이징
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
  gentle: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
} as const;

// 기본 키프레임 생성 함수들
export const keyframes = {
  // 페이드 인/아웃
  fadeIn: [{ opacity: 0 }, { opacity: 1 }],

  fadeOut: [{ opacity: 1 }, { opacity: 0 }],

  // 슬라이드 애니메이션들
  slideUp: [
    { transform: "translateY(100%)", opacity: 0 },
    { transform: "translateY(0)", opacity: 1 },
  ],

  slideDown: [
    { transform: "translateY(-100%)", opacity: 0 },
    { transform: "translateY(0)", opacity: 1 },
  ],

  slideLeft: [
    { transform: "translateX(100%)", opacity: 0 },
    { transform: "translateX(0)", opacity: 1 },
  ],

  slideRight: [
    { transform: "translateX(-100%)", opacity: 0 },
    { transform: "translateX(0)", opacity: 1 },
  ],

  // 스케일 애니메이션들
  scaleIn: [
    { transform: "scale(0)", opacity: 0 },
    { transform: "scale(1)", opacity: 1 },
  ],

  scaleOut: [
    { transform: "scale(1)", opacity: 1 },
    { transform: "scale(0)", opacity: 0 },
  ],

  // 회전 애니메이션들
  rotateIn: [
    { transform: "rotate(-180deg)", opacity: 0 },
    { transform: "rotate(0deg)", opacity: 1 },
  ],

  rotateOut: [
    { transform: "rotate(0deg)", opacity: 1 },
    { transform: "rotate(180deg)", opacity: 0 },
  ],

  // 바운스 애니메이션
  bounce: [
    { transform: "scale(1)" },
    { transform: "scale(1.1)" },
    { transform: "scale(0.95)" },
    { transform: "scale(1.05)" },
    { transform: "scale(1)" },
  ],

  // 펄스 애니메이션
  pulse: [
    { transform: "scale(1)" },
    { transform: "scale(1.05)" },
    { transform: "scale(1)" },
  ],

  // 흔들기 애니메이션
  shake: [
    { transform: "translateX(0)" },
    { transform: "translateX(-10px)" },
    { transform: "translateX(10px)" },
    { transform: "translateX(-10px)" },
    { transform: "translateX(10px)" },
    { transform: "translateX(-5px)" },
    { transform: "translateX(5px)" },
    { transform: "translateX(0)" },
  ],

  // 플립 애니메이션
  flip: [
    { transform: "perspective(400px) rotateY(0)" },
    { transform: "perspective(400px) rotateY(-90deg)" },
    { transform: "perspective(400px) rotateY(-180deg)" },
  ],

  // 줌 인/아웃
  zoomIn: [
    { transform: "scale(0.3)", opacity: 0 },
    { transform: "scale(1)", opacity: 1 },
  ],

  zoomOut: [
    { transform: "scale(1)", opacity: 1 },
    { transform: "scale(0.3)", opacity: 0 },
  ],
} as const;

// 애니메이션 지속 시간 프리셋
export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
  slowest: 1000,
} as const;

// 애니메이션 지연 프리셋
export const delays = {
  none: 0,
  short: 100,
  medium: 200,
  long: 300,
  longer: 500,
} as const;

// 애니메이션 설정 생성 함수
export function createAnimationConfig(
  duration: keyof typeof durations = "normal",
  easing: keyof typeof easing = "smooth",
  delay: keyof typeof delays = "none",
) {
  return {
    duration: durations[duration],
    easing: easing[easing],
    delay: delays[delay],
  };
}

// 스태거 애니메이션을 위한 지연 계산
export function calculateStaggerDelay(
  index: number,
  baseDelay: number = 100,
  staggerDelay: number = 50,
): number {
  return baseDelay + index * staggerDelay;
}

// 랜덤 애니메이션 선택
export function getRandomAnimation(): keyof typeof keyframes {
  const animations = Object.keys(keyframes) as Array<keyof typeof keyframes>;
  return animations[Math.floor(Math.random() * animations.length)];
}

// 애니메이션 체인 생성
export function createAnimationChain(
  animations: Array<{
    keyframes: Keyframe[] | PropertyIndexedKeyframes;
    duration?: number;
    delay?: number;
    easing?: string;
  }>,
) {
  return animations.map((animation, index) => ({
    ...animation,
    delay: animation.delay || index * 100, // 기본적으로 100ms씩 지연
  }));
}

// 반응형 애니메이션 설정
export function getResponsiveAnimation(
  mobile: any,
  tablet: any,
  desktop: any,
  screenWidth: number,
) {
  if (screenWidth < 768) {
    return mobile;
  } else if (screenWidth < 1024) {
    return tablet;
  } else {
    return desktop;
  }
}

// 애니메이션 성능 최적화를 위한 will-change 설정
export function setWillChange(element: HTMLElement, properties: string[]) {
  element.style.willChange = properties.join(", ");
}

// 애니메이션 완료 후 will-change 제거
export function clearWillChange(element: HTMLElement) {
  element.style.willChange = "auto";
}

// GPU 가속을 위한 transform3d 사용
export function enableGPUAcceleration(element: HTMLElement) {
  element.style.transform = "translate3d(0, 0, 0)";
}

// 애니메이션 중지 및 리셋
export function stopAndResetAnimation(element: HTMLElement) {
  element.getAnimations().forEach((animation) => {
    animation.cancel();
  });

  // 스타일 리셋
  element.style.transform = "";
  element.style.opacity = "";
  element.style.transition = "";
}

// 애니메이션 완료 대기
export function waitForAnimation(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const animations = element.getAnimations();

    if (animations.length === 0) {
      resolve();
      return;
    }

    Promise.all(animations.map((animation) => animation.finished)).then(() =>
      resolve(),
    );
  });
}
