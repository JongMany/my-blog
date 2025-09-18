export interface SpringConfig {
  stiffness: number;
  damping: number;
}

export interface SggoiTransition {
  in: (
    element: HTMLElement,
    context: TransitionContext,
  ) => Promise<TransitionAnimation>;
  out: (element: HTMLElement) => Promise<TransitionOut>;
}

export interface TransitionContext {
  scrollOffset: { x: number; y: number };
}

export interface TransitionAnimation {
  spring: SpringConfig;
  prepare?: () => void;
  tick: (progress: number) => void;
  onEnd?: () => void;
}

export interface TransitionOut {
  onStart?: () => void;
  prepare?: (element: HTMLElement) => void;
}

export interface HeroOptions {
  spring?: Partial<SpringConfig>;
  timeout?: number;
}
