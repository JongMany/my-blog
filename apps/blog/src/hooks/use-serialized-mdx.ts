import { useSerializedMDX as useSerializedMDXBase } from "@srf/ui";
import { blogSerializeConfig } from "@/components/mdx/blog-mdx-config";

/**
 * MDX 콘텐츠를 시리얼라이즈하는 커스텀 훅
 *
 * @param content - 시리얼라이즈할 MDX 콘텐츠 문자열
 * @returns 시리얼라이즈된 MDX의 compiledSource
 *
 * @example
 * ```tsx
 * const { compiledSource } = useSerializedMDX(content);
 * ```
 */
export function useSerializedMDX(content: string) {
  return useSerializedMDXBase(content, blogSerializeConfig);
}

