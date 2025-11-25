/**
 * 문자열 관련 유틸리티 함수들
 */

/**
 * 문자열이 포함되어 있는지 대소문자 구분 없이 확인하는 순수함수
 */
export function includesIgnoreCase(
  text: string | undefined | null,
  query: string,
): boolean {
  return (text ?? "").toLowerCase().includes(query.toLowerCase());
}

