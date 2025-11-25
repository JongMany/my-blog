/**
 * 파일 경로 관련 유틸리티 함수들
 */

/**
 * 파일 경로를 정규화합니다.
 * 상대 경로를 절대 경로로 변환하고 백슬래시를 슬래시로 변경합니다.
 * @param filePath - 정규화할 파일 경로
 * @param basePath - 기본 경로 (예: "/contents")
 */
export function normalizeFilePath(
  filePath: string,
  basePath = "/contents",
): string {
  return filePath
    .replace(/^\.\.\/contents\//, `${basePath}/`)
    .replace(/\\/g, "/");
}
