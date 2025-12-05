import { use, useMemo } from "react";
import { serialize } from "../lib/serializer/serialize";
import type { SerializeOptions } from "../types";

/**
 * MDX 콘텐츠 시리얼라이즈 훅
 */
export function useSerializedMDX(content: string, options: SerializeOptions) {
  const promise = useMemo(
    () => serialize(content, options),
    [content, options.remarkPlugins, options.rehypePlugins, options.sanitizeSource]
  );
  
  const { compiledSource } = use(promise);
  return { compiledSource };
}

