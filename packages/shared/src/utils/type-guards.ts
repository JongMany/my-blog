/**
 * 타입 가드 유틸리티 함수들
 */

/**
 * 값이 문자열인지 확인하는 타입 가드
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * 값이 숫자인지 확인하는 타입 가드
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

/**
 * 값이 불리언인지 확인하는 타입 가드
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * 값이 배열인지 확인하는 타입 가드
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * 값이 객체인지 확인하는 타입 가드 (null 제외)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

