/**
 * 문자열 관련 유틸리티 함수들
 */

interface ContainsOptions {
  ignoreCase?: boolean;
}

/**
 * 문자열이 포함되어 있는지 확인하는 순수함수
 *
 * @param text - 검색 대상 문자열
 * @param query - 검색할 문자열
 * @param options - 옵션 객체
 * @param options.ignoreCase - 대소문자 구분 여부 (기본값: false)
 * @returns 포함 여부
 */
export function contains(
  text: string | undefined | null,
  query: string,
  options: ContainsOptions = {},
): boolean {
  const { ignoreCase = false } = options;
  const normalizedText = text ?? "";
  const normalizedQuery = query;

  if (ignoreCase) {
    return normalizedText.toLowerCase().includes(normalizedQuery.toLowerCase());
  }

  return normalizedText.includes(normalizedQuery);
}
