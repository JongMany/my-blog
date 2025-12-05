import { useSerializedMDX } from "@srf/ui";
import { portfolioSerializeOptions } from "@/components/mdx/portfolio-mdx-config";

/**
 * MDX 콘텐츠 시리얼라이즈 훅
 */
export function useMdxContent(mdxSource: string | null) {
  if (!mdxSource) {
    return { compiledSource: null };
  }

  return useSerializedMDX(mdxSource, portfolioSerializeOptions);
}
