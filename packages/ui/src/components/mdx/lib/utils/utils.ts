/**
 * 외부 링크 여부 확인
 */
export function isExternalLink(url?: string): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url) || url.startsWith("//");
}
