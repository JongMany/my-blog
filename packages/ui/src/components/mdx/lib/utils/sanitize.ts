/**
 * MDX 소스 정제 함수
 * BOM 제거, 줄바꿈 정규화, 중괄호 이스케이프 처리
 *
 * @param src - 원본 MDX 소스 문자열
 * @returns 정제된 MDX 소스 문자열
 */
export function sanitizeMdxSource(src: string): string {
  return src
    .replace(/^\uFEFF/, "") // BOM 제거
    .replace(/\r\n/g, "\n") // Windows 줄바꿈 정규화
    .replace(/{{/g, "\\{\\{") // 중괄호 이스케이프
    .replace(/}}/g, "\\}\\}"); // 중괄호 이스케이프
}

