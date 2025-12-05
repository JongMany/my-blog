import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { SerializeConfig } from "../../types";

/**
 * 기본 serialize 설정 생성
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

