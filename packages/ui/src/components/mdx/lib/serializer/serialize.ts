import { serialize as serializeMDX } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { SerializeConfig } from "../../types";

/**
 * 순수 함수: 기본 serialize 설정 생성
 */
export function createDefaultSerializeConfig(): SerializeConfig {
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
 * 순수 함수: MDX 소스를 serialize
 */
export async function serialize(
  source: string,
  config: SerializeConfig
) {
  const sanitizedSource = config.sanitizeSource?.(source) ?? source;

  return serializeMDX(sanitizedSource, {
    mdxOptions: {
      remarkPlugins: config.remarkPlugins ?? [],
      rehypePlugins: config.rehypePlugins ?? [],
    },
  });
}
