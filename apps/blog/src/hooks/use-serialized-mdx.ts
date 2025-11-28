import { use, useMemo } from "react";
import { serialize } from "@/utils/mdx";

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
  // Promise를 메모이제이션하여 안정적인 참조 유지
  const serializedPromise = useMemo(() => serialize(content), [content]);
  const { compiledSource } = use(serializedPromise);

  return { compiledSource };
}

