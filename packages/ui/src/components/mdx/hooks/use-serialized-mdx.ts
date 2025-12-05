import { use, useMemo } from "react";
import { serialize } from "../lib/serializer/serialize";
import type { SerializeConfig } from "../types";

/**
 * MDX 콘텐츠를 시리얼라이즈하는 커스텀 훅
 *
 * @param content - 시리얼라이즈할 MDX 콘텐츠 문자열
 * @param config - Serialize 설정
 * @returns 시리얼라이즈된 MDX의 compiledSource
 */
export function useSerializedMDX(content: string, config: SerializeConfig) {
  const serializedPromise = useMemo(
    () => serialize(content, config),
    // config 객체의 참조 동일성 문제를 피하기 위해 개별 속성 사용
    [
      content,
      config.remarkPlugins,
      config.rehypePlugins,
      config.sanitizeSource,
    ]
  );
  const { compiledSource } = use(serializedPromise);
  
  return { compiledSource };
}

