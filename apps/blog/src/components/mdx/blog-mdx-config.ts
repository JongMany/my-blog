import { Link } from "react-router-dom";
import type { RuntimeConfig, SerializeOptions } from "@srf/ui";
import {
  createDefaultSerializeOptions,
  createProcessImageSource,
} from "@srf/ui";

/**
 * 런타임 설정
 */
export const blogRuntimeConfig: RuntimeConfig = {
  processImageSource: createProcessImageSource("blog"),
  appName: "blog",
};

/**
 * 링크 컴포넌트
 */
export const blogLinkComponent = Link;

/**
 * Serialize 옵션
 *
 * Blog는 기본 옵션만 사용합니다.
 *
 * MDX 처리 파이프라인:
 * - sanitizeSource: 없음 (기본 처리)
 * - remarkPlugins: 없음 (기본 처리)
 * - rehypePlugins: 기본 플러그인만 사용
 *   1. rehypeSlug: 제목에 id 속성 추가
 *   2. rehypeAutolinkHeadings: 제목에 앵커 링크 자동 추가
 *   3. rehypePrettyCode: 코드 블록 문법 하이라이팅 (기본 설정)
 */
export const blogSerializeOptions: SerializeOptions = {
  ...createDefaultSerializeOptions(),
};

