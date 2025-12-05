import { serialize as serializeMDX } from "next-mdx-remote/serialize";
import type { SerializeConfig } from "../../types";

/**
 * MDX 소스를 serialize
 * Strategy Pattern: 설정을 주입받아 다양한 serialize 전략 지원
 */
export async function serialize(source: string, config: SerializeConfig) {
  const sanitizedSource = config.sanitizeSource?.(source) ?? source;
  
  return serializeMDX(sanitizedSource, {
    mdxOptions: {
      remarkPlugins: config.remarkPlugins ?? [],
      rehypePlugins: config.rehypePlugins ?? [],
    },
  });
}

