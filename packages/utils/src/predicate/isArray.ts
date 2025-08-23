/**
 * @description 주어진 값이 배열인지 확인합니다. 배열 타입이 맞다면 인자의 타입은 배열로 타입을 좁혀줍니다.
 */
export function isArray<T>(value: unknown): value is T[] | readonly T[] {
  return Array.isArray(value);
}
