import { Link } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import type { Element } from "hast";
import { isExternalLink, rehypeUnwrapImages, rehypeSkipMermaid } from "@srf/ui";
import type { RuntimeConfig, SerializeOptions, RehypePlugin } from "@srf/ui";
import { createDefaultSerializeOptions } from "@srf/ui";

/**
 * 이미지 소스 처리
 */
function processImageSource(src: string, appName: string): string {
  if (isExternalLink(src)) return src;

  const isDevelopment = import.meta.env.MODE === "development";
  return imageSource(src, appName as "portfolio", { isDevelopment });
}

/**
 * 런타임 설정
 */
export const portfolioRuntimeConfig: RuntimeConfig = {
  processImageSource,
  appName: "portfolio",
};

/**
 * 링크 컴포넌트
 */
export const portfolioLinkComponent = Link;

/**
 * MDX 소스 정제 함수
 * BOM 제거, 줄바꿈 정규화, 중괄호 이스케이프 처리
 */
export function sanitizeMdxSource(src: string): string {
  return src
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/{{/g, "\\{\\{")
    .replace(/}}/g, "\\}\\}");
}

/**
 * 플러그인 배열에서 특정 플러그인을 제거하는 유틸리티
 */
function removePlugin(
  plugins: RehypePlugin[],
  targetPlugin: unknown,
): RehypePlugin[] {
  return plugins.filter((plugin) => {
    if (Array.isArray(plugin)) {
      return plugin[0] !== targetPlugin;
    }
    return plugin !== targetPlugin;
  });
}

/**
 * rehypePrettyCode 설정
 */
const rehypePrettyCodeOptions = {
  theme: "dark-plus",
  filterMetaString: (string: string) => string.replace(/filename="[^"]*"/, ""),
  onVisitHighlightedLine(node: Element) {
    if (node.properties && Array.isArray(node.properties.className)) {
      node.properties.className.push("highlighted");
    }
  },
  onVisitHighlightedWord(node: Element) {
    node.properties.className = ["word"];
  },
} as const;

/**
 * Serialize 옵션
 *
 * MDX 처리 파이프라인:
 *
 * [전처리 단계]
 * - sanitizeMdxSource: BOM 제거, 줄바꿈 정규화, 중괄호 이스케이프
 *
 * [Remark 플러그인 단계 - 마크다운 처리]
 * 1. remarkGfm: GitHub Flavored Markdown 지원
 *   - 테이블, 체크리스트, 자동 링크, 취소선 등
 *
 * [Rehype 플러그인 단계 - HTML 처리]
 * 기본 플러그인 (createDefaultSerializeOptions에서 제공):
 * 1. rehypeSlug: 제목에 id 속성 추가
 * 2. rehypeAutolinkHeadings: 제목에 앵커 링크 자동 추가
 *
 * Portfolio 전용 플러그인:
 * 3. rehypeUnwrapImages: 이미지를 포함한 <p> 태그를 <div>로 변환
 * 4. rehypeSkipMermaid: Mermaid 코드 블록을 <div>로 변환하여 별도 처리
 * 5. rehypePrettyCode: 코드 블록 문법 하이라이팅 (포트폴리오 전용 설정)
 *   - highlighted 라인/단어 스타일링
 *   - filename 메타데이터 필터링
 */
const defaultOptions = createDefaultSerializeOptions();
// 기본 옵션의 rehypePrettyCode를 제거 (포트폴리오 전용 설정으로 교체)
const baseRehypePlugins = removePlugin(
  defaultOptions.rehypePlugins ?? [],
  rehypePrettyCode,
);

export const portfolioSerializeOptions: SerializeOptions = {
  ...defaultOptions,
  // Remark 플러그인: 마크다운 처리
  remarkPlugins: [remarkGfm],
  // Rehype 플러그인: HTML 처리 (순서 중요!)
  rehypePlugins: [
    ...baseRehypePlugins, // 기본 플러그인 (rehypeSlug, rehypeAutolinkHeadings)
    rehypeUnwrapImages, // 이미지 래핑 해제
    rehypeSkipMermaid, // Mermaid 코드 블록 처리
    [rehypePrettyCode, rehypePrettyCodeOptions], // 코드 하이라이팅 (포트폴리오 전용 설정)
  ],
  sanitizeSource: sanitizeMdxSource,
};
