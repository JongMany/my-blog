/**
 * 현재 테마가 다크 모드인지 확인하는 함수
 * @returns 다크 모드인지 여부
 */
export function isDarkMode(): boolean {
  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}
