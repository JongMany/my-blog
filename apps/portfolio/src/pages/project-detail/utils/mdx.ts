import type { ComponentType } from "react";
import { evaluate, UseMdxComponents } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { components } from "../../../components/mdx-theme";

// evaluate에 주입할 훅
const useMDXComponents: UseMdxComponents = () => ({
  ...components,
});

/**
 * MDX 소스 코드를 정리하는 순수함수
 */
export function sanitizeMdxSource(src: string): string {
  return src
    .replace(/^\uFEFF/, "") // BOM 제거
    .replace(/\r\n/g, "\n") // CRLF → LF
    .replace(/{{/g, "\\{\\{") // 템플릿 더블 중괄호 방어
    .replace(/}}/g, "\\}\\}");
}

/**
 * MDX 소스에서 React 컴포넌트를 생성하는 순수함수
 */
export async function createMdxComponent(
  source: string,
): Promise<ComponentType> {
  const sanitizedSource = sanitizeMdxSource(source);
  const { default: MDXContent } = await evaluate(sanitizedSource, {
    ...runtime,
    useMDXComponents,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  });
  return MDXContent as ComponentType;
}
