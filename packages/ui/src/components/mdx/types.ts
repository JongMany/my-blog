import type { ReactNode, ComponentType } from "react";

/**
 * MDX 런타임 설정
 * 앱별로 다른 라우팅, 리소스 처리 등을 주입받음
 */
export interface MDXRuntimeConfig {
  /**
   * 내부 링크를 렌더링하는 컴포넌트
   */
  LinkComponent: ComponentType<{
    to: string;
    children: ReactNode;
    className?: string;
    [key: string]: any;
  }>;
  
  /**
   * 이미지 소스를 처리하는 함수
   */
  processImageSource: (src: string, appName: string) => string;
  
  /**
   * 앱 이름 (blog, portfolio 등)
   */
  appName: string;
}

/**
 * Serialize 설정
 */
export interface SerializeConfig {
  remarkPlugins?: any[];
  rehypePlugins?: any[];
  sanitizeSource?: (source: string) => string;
}

/**
 * 컴포넌트 맵 생성 옵션
 */
export interface ComponentMapOptions {
  runtimeConfig: MDXRuntimeConfig;
  customComponents?: Record<string, ComponentType<any>>;
  enableMermaid?: boolean;
}

