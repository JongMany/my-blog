# 인터랙션 컴포넌트 사용 가이드

SSGOI의 핵심 아이디어를 참고하여 구현한 페이지 전환 및 요소 애니메이션 컴포넌트들입니다.

## 주요 컴포넌트

### 1. TransitionProvider

페이지 전환을 위한 컨텍스트 프로바이더입니다.

```tsx
import {
  TransitionProvider,
  TransitionContainer,
  TransitionPage,
} from "@srf/ui";

function App() {
  return (
    <TransitionProvider>
      <TransitionContainer>
        <TransitionPage id="home">
          <h1>홈 페이지</h1>
        </TransitionPage>
        <TransitionPage id="about">
          <h1>소개 페이지</h1>
        </TransitionPage>
      </TransitionContainer>
    </TransitionProvider>
  );
}
```

### 2. TransitionElement

개별 요소의 애니메이션을 위한 컴포넌트입니다.

```tsx
import {
  TransitionElement,
  FadeIn,
  SlideUp,
  ScaleIn
} from '@srf/ui';

// 기본 사용법
<TransitionElement config={{ in: 'fade', duration: 300 }}>
  <div>애니메이션 요소</div>
</TransitionElement>

// 편의 컴포넌트 사용
<FadeIn>
  <div>페이드 인 효과</div>
</FadeIn>

<SlideUp>
  <div>슬라이드 업 효과</div>
</SlideUp>

<ScaleIn>
  <div>스케일 인 효과</div>
</ScaleIn>
```

### 3. useAnimation 훅

고급 애니메이션 제어를 위한 훅입니다.

```tsx
import { useAnimation, keyframes, easing } from "@srf/ui";

function AnimatedComponent() {
  const { state, play, pause, reset } = useAnimation(keyframes.bounce, {
    duration: 500,
    easing: easing.bounce,
  });

  return (
    <div>
      <button onClick={play}>애니메이션 시작</button>
      <button onClick={pause}>일시정지</button>
      <button onClick={reset}>리셋</button>
      <div>상태: {state}</div>
    </div>
  );
}
```

### 4. useScrollAnimation 훅

스크롤 기반 애니메이션을 위한 훅입니다.

```tsx
import { useScrollAnimation, FadeIn } from "@srf/ui";

function ScrollAnimatedComponent() {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  return (
    <FadeIn ref={elementRef}>
      <div>{isVisible ? "화면에 보입니다!" : "화면에 보이지 않습니다."}</div>
    </FadeIn>
  );
}
```

### 5. useHoverAnimation 훅

호버 애니메이션을 위한 훅입니다.

```tsx
import { useHoverAnimation, keyframes } from "@srf/ui";

function HoverComponent() {
  const { elementRef, isHovered, handleMouseEnter, handleMouseLeave } =
    useHoverAnimation(keyframes.scaleIn, keyframes.scaleOut, { duration: 200 });

  return (
    <div
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      호버 효과: {isHovered ? "활성" : "비활성"}
    </div>
  );
}
```

## 전환 효과 프리셋

```tsx
import { transitionPresets, usePageTransition } from "@srf/ui";

function Navigation() {
  const { navigateTo } = usePageTransition();

  const handleNavigation = async () => {
    await navigateTo("home", "about", transitionPresets.slideLeft);
  };

  return <button onClick={handleNavigation}>페이지 이동</button>;
}
```

## 애니메이션 유틸리티

```tsx
import { keyframes, easing, durations, createAnimationConfig } from "@srf/ui";

// 키프레임 사용
const customKeyframes = keyframes.fadeIn;

// 이징 사용
const customEasing = easing.bounce;

// 지속 시간 사용
const customDuration = durations.slow;

// 설정 생성
const config = createAnimationConfig("slow", "bounce", "medium");
```

## 고급 사용법

### 시퀀스 애니메이션

```tsx
import { useSequenceAnimation, keyframes } from "@srf/ui";

function SequenceComponent() {
  const { elementRef, currentIndex, playSequence } = useSequenceAnimation([
    { keyframes: keyframes.fadeIn, config: { duration: 300 } },
    { keyframes: keyframes.slideUp, config: { duration: 400 }, delay: 100 },
    { keyframes: keyframes.scaleIn, config: { duration: 200 }, delay: 200 },
  ]);

  return (
    <div>
      <button onClick={playSequence}>시퀀스 시작</button>
      <div ref={elementRef}>현재 단계: {currentIndex}</div>
    </div>
  );
}
```

### 반응형 애니메이션

```tsx
import { getResponsiveAnimation, keyframes } from "@srf/ui";

function ResponsiveComponent() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const animation = getResponsiveAnimation(
    keyframes.fadeIn, // 모바일
    keyframes.slideUp, // 태블릿
    keyframes.scaleIn, // 데스크톱
    screenWidth,
  );

  return (
    <TransitionElement config={{ in: animation.type }}>
      <div>반응형 애니메이션</div>
    </TransitionElement>
  );
}
```

## 성능 최적화 팁

1. **GPU 가속 사용**: `enableGPUAcceleration()` 함수 사용
2. **will-change 설정**: 애니메이션 전에 `setWillChange()` 호출
3. **애니메이션 완료 후 정리**: `clearWillChange()` 호출
4. **불필요한 애니메이션 제거**: `stopAndResetAnimation()` 사용

```tsx
import { enableGPUAcceleration, setWillChange, clearWillChange } from "@srf/ui";

function OptimizedComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      enableGPUAcceleration(element);
      setWillChange(element, ["transform", "opacity"]);

      // 애니메이션 완료 후
      setTimeout(() => {
        clearWillChange(element);
      }, 1000);
    }
  }, []);

  return <div ref={elementRef}>최적화된 애니메이션</div>;
}
```

이 컴포넌트들을 사용하여 SSGOI와 유사한 부드러운 페이지 전환과 요소 애니메이션을 구현할 수 있습니다.
