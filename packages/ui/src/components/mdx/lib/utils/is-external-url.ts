/**
 * 순수 함수: URL이 외부 링크인지 확인
 * MDX Link 컴포넌트에서 사용
 *
 * @param url - 확인할 URL 문자열
 * @returns 외부 링크인지 여부
 *
 * @example
 * ```ts
 * isExternalUrl("https://example.com"); // true
 * isExternalUrl("/blog/post"); // false
 * isExternalUrl("//example.com"); // true
 * ```
 */
export const isExternalUrl = (url?: string): boolean => {
  if (!url) return false;
  return /^https?:\/\//i.test(url) || url.startsWith("//");
};

