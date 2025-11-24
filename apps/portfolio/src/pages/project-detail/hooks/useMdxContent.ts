import { use, useMemo } from "react";
import { serializeMdx } from "../../../components/mdx";

/**
 * MDX 콘텐츠를 시리얼라이즈하는 커스텀 훅
 */
export function useMdxContent(mdxSource: string | null) {
  const serializedPromise = useMemo(() => {
    if (!mdxSource) return null;
    return serializeMdx(mdxSource);
  }, [mdxSource]);

  if (!serializedPromise) {
    return { compiledSource: null };
  }

  const { compiledSource } = use(serializedPromise);
  return { compiledSource };
}
