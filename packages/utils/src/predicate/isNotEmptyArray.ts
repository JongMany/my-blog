/**
 * 주어진 배열이 비어 있지 않은 유효한 배열인지 확인합니다.
 *
 * @template T - 배열의 요소 타입.
 * @param {T[] | undefined} arr - 검사할 배열. `undefined`일 수도 있습니다.
 * @returns {arr is T[]} 배열이 비어 있지 않으면 `true`, 그렇지 않으면 `false`.
 *
 * @example
 * const result1 = checkIsNotEmptyArray([1, 2, 3]);
 * console.log(result1); // true
 *
 * const result2 = checkIsNotEmptyArray([]);
 * console.log(result2); // false
 *
 * const result3 = checkIsNotEmptyArray(undefined);
 * console.log(result3); // false
 */
export function isNotEmptyArray<T>(arr?: T[]): arr is T[] {
  if (arr && Array.isArray(arr) && arr.length > 0) {
    return true;
  }
  return false;
}
