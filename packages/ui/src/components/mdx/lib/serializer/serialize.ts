import { serialize as serializeMDX } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { SerializeOptions } from "../../types";

/**
 * 기본 serialize 옵션 생성
 *
 * MDX 처리 파이프라인:
 * 1. 원본 MDX 텍스트
 * 2. sanitizeSource (전처리: BOM 제거, 줄바꿈 정규화 등)
 * 3. remark 플러그인 (마크다운 → MDAST)
 *    - 마크다운 문법을 추상 구문 트리(AST)로 변환
 *    - 예: remarkGfm (GitHub Flavored Markdown 지원)
 * 4. MDX 컴파일 (MDAST → MDX AST)
 * 5. rehype 플러그인 (HAST → 최종 HTML)
 *    - HTML 추상 구문 트리를 처리하여 최종 HTML 생성
 *    - 아래 순서로 실행됨:
 *      a. rehypeSlug: 제목에 id 속성 추가 (앵커 링크용)
 *      b. rehypeAutolinkHeadings: 제목에 앵커 링크 자동 추가
 *      c. rehypePrettyCode: 코드 블록 문법 하이라이팅
 */
export function createDefaultSerializeOptions(): SerializeOptions {
  return {
    rehypePlugins: [
      // 1. 제목 태그에 id 속성 추가 (예: <h1 id="title">)
      rehypeSlug,
      // 2. 제목에 앵커 링크 자동 추가 (예: <h1><a href="#title">Title</a></h1>)
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["anchor"],
            ariaLabel: "anchor",
          },
        },
      ],
      // 3. 코드 블록 문법 하이라이팅 (VS Code dark-plus 테마)
      [rehypePrettyCode, { theme: "dark-plus" }],
    ],
  };
}

/**
 * MDX 콘텐츠 시리얼라이즈
 *
 * 처리 순서:
 * 1. sanitizeSource: 소스 코드 전처리 (BOM 제거, 줄바꿈 정규화 등)
 * 2. remarkPlugins: 마크다운 처리 (GFM, 테이블, 체크리스트 등)
 * 3. MDX 컴파일: JSX 변환
 * 4. rehypePlugins: HTML 처리 (slug, 앵커, 코드 하이라이팅 등)
 *
 * @param content - 원본 MDX 텍스트
 * @param options - serialize 옵션 (플러그인, 전처리 함수 등)
 * @returns 컴파일된 MDX 소스와 frontmatter
 */
export async function serialize(content: string, options: SerializeOptions) {
  // 1단계: 소스 코드 전처리
  const sanitized = options.sanitizeSource?.(content) ?? content;

  // 2-5단계: MDX 컴파일 및 플러그인 처리
  return serializeMDX(sanitized, {
    mdxOptions: {
      // remark 플러그인: 마크다운 → MDAST 변환 단계
      remarkPlugins: options.remarkPlugins ?? [],
      // rehype 플러그인: HAST → HTML 변환 단계
      rehypePlugins: options.rehypePlugins ?? [],
    },
  });
}
