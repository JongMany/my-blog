import { serialize as serializeMDX } from "next-mdx-remote/serialize";
import type { SerializeConfig } from "../../types";

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

