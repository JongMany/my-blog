/**
 * 사용 중단: Vite의 import.meta.glob은 리터럴 문자열만 허용합니다.
 *
 * 동적 패턴을 사용할 수 없으므로, 각 사용처에서 직접 import.meta.glob을 사용하세요.
 *
 * @deprecated 각 사용처에서 직접 import.meta.glob을 사용하세요.
 * 예: service/books.ts 참고
 */
export function getContents<T extends { slug: string; path: string }>(
  contentsPath: string,
): T[] {
  throw new Error(
    "getContents는 더 이상 사용할 수 없습니다. Vite의 import.meta.glob은 리터럴 문자열만 허용합니다. 각 사용처에서 직접 import.meta.glob을 사용하세요.",
  );
}
