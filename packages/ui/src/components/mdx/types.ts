import type { ReactNode, ComponentType } from "react";

/**
 * 앱 이름 타입
 */
export type AppName = "blog" | "portfolio" | "home" | "resume";

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
 * 앱별로 다른 리소스 처리 등을 주입받음
 */
export interface RuntimeConfig {
  /** 이미지 소스를 처리하는 함수 */
  processImageSource: (src: string, appName: AppName) => string;

  /** 앱 이름 (blog, portfolio 등) */
  appName: AppName;
}

/**
 * Unified 플러그인 함수 타입
 * 플러그인은 다양한 시그니처를 가질 수 있음
 */
type PluginFunction = (...args: any[]) => any;

/**
 * 플러그인 튜플 타입
 * [플러그인 함수, 옵션] 형태
 */
type PluginTuple = [plugin: PluginFunction, options: any];

/**
 * Remark 플러그인 타입
 * 단일 플러그인 함수 또는 [플러그인, 옵션] 튜플 형태
 * @see https://github.com/unifiedjs/unified#plugin
 */
export type RemarkPlugin = PluginFunction | PluginTuple;

/**
 * Rehype 플러그인 타입
 * 단일 플러그인 함수 또는 [플러그인, 옵션] 튜플 형태
 * @see https://github.com/unifiedjs/unified#plugin
 */
export type RehypePlugin = PluginFunction | PluginTuple;

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
 * Frontmatter 데이터 타입
 * MDX 파일의 frontmatter에서 추출된 메타데이터를 나타냅니다.
 */
export type FrontmatterData = Record<string, unknown>;
