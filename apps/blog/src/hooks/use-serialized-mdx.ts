import { useSerializedMDX as useSerializedMDXBase } from "@srf/ui";
import { blogSerializeOptions } from "@/components/mdx/blog-mdx-config";

/**
 * MDX 콘텐츠 시리얼라이즈 훅
 */
export function useSerializedMDX(content: string) {
  return useSerializedMDXBase(content, blogSerializeOptions);
}

