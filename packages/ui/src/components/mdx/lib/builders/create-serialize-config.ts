import type { SerializeConfig } from "../../types";

/**
 * 순수 함수: SerializeConfig 생성
 */
export function createSerializeConfig(
  config: SerializeConfig
): SerializeConfig {
  return {
    remarkPlugins: config.remarkPlugins ?? [],
    rehypePlugins: config.rehypePlugins ?? [],
    sanitizeSource: config.sanitizeSource,
  };
}

/**
 * 순수 함수: 기본 설정과 병합하여 SerializeConfig 생성
 */
export function mergeSerializeConfig(
  base: SerializeConfig,
  overrides: Partial<SerializeConfig>
): SerializeConfig {
  return {
    remarkPlugins: overrides.remarkPlugins ?? base.remarkPlugins ?? [],
    rehypePlugins: overrides.rehypePlugins ?? base.rehypePlugins ?? [],
    sanitizeSource: overrides.sanitizeSource ?? base.sanitizeSource,
  };
}

