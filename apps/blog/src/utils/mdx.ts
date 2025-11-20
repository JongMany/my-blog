import { serialize as serializeMDX } from "next-mdx-remote/serialize";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

export async function serialize(content: string) {
  return serializeMDX(content, {
    mdxOptions: {
      /**
       * 다음 link와 같은 TS error로 인해 next-remote-mdx의 버전을 4.4.1로 사용
       * @link https://github.com/hashicorp/next-mdx-remote/issues/423
       */
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
    },
  });
}
