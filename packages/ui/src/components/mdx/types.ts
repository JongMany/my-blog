import type { ReactNode, ComponentType } from "react";

/**
 * 링크 컴포넌트의 props 타입
 */
export interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

/**
 * 런타임 설정
 * 앱별로 다른 라우팅, 리소스 처리 등을 주입받음
 */
export interface RuntimeConfig {
  /** 내부 링크를 렌더링하는 컴포넌트 */
  LinkComponent: ComponentType<LinkProps>;
  
  /** 이미지 소스를 처리하는 함수 */
  processImageSource: (src: string, appName: string) => string;
  
  /** 앱 이름 (blog, portfolio 등) */
  appName: string;
}

/**
 * Remark 플러그인 타입
 */
export type RemarkPlugin = unknown;

/**
 * Rehype 플러그인 타입
 */
export type RehypePlugin = unknown;

/**
 * Serialize 옵션
 */
export interface SerializeOptions {
  remarkPlugins?: RemarkPlugin[];
  rehypePlugins?: RehypePlugin[];
  sanitizeSource?: (content: string) => string;
}

/**
 * MDX 컴포넌트 맵
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentMap = Record<string, ComponentType<any>>;

/**
 * 컴포넌트 맵 생성 설정
 */
export interface ComponentMapConfig {
  runtime: RuntimeConfig;
  custom?: ComponentMap;
}

