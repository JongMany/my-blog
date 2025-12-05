import { serialize as serializeMDX } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { SerializeOptions } from "../../types";

/**
 * 기본 serialize 옵션 생성
 */
export function createDefaultSerializeOptions(): SerializeOptions {
  return {
    rehypePlugins: [
      rehypeSlug,
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
      [rehypePrettyCode, { theme: "dark-plus" }],
    ],
  };
}

/**
 * MDX 콘텐츠 시리얼라이즈
 */
export async function serialize(content: string, options: SerializeOptions) {
  const sanitized = options.sanitizeSource?.(content) ?? content;

  return serializeMDX(sanitized, {
    mdxOptions: {
      remarkPlugins: options.remarkPlugins ?? [],
      rehypePlugins: options.rehypePlugins ?? [],
    },
  });
}
