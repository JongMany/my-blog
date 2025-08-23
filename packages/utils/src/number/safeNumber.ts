type Decimal = string | number;

/**
 * undefined나 null이 들어와도 안전하게 숫자(기본값)로 변환
 * @param value 변환할 값
 * @param fallback 기본값 (값이 없거나 유효하지 않을 때 사용)
 * @returns 변환된 숫자
 */
export function safeNumber(value: Decimal | undefined | null, fallback = 0): number {
  if (value === undefined || value === null) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}
