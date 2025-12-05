import { useSerializedMDX } from "@srf/ui";
import { portfolioSerializeConfig } from "@/components/mdx/portfolio-mdx-config";

/**
 * MDX 콘텐츠를 시리얼라이즈하는 커스텀 훅
 * portfolio 앱의 serialize 설정을 사용
 */
export function useMdxContent(mdxSource: string | null) {
  if (!mdxSource) {
    return { compiledSource: null };
  }

  return useSerializedMDX(mdxSource, portfolioSerializeConfig);
}
