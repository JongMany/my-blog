/**
 * Frontmatter 데이터 정규화 유틸리티 함수들
 */

/**
 * 태그 배열을 정규화합니다.
 * 배열, 쉼표/공백으로 구분된 문자열을 배열로 변환합니다.
 */
export function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0);
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    const parts = trimmed.includes(",")
      ? trimmed.split(",")
      : trimmed.split(" ");

    return parts.map((part) => part.trim()).filter((part) => part.length > 0);
  }

  return [];
}

/**
 * 불리언 값을 정규화합니다.
 * boolean, "true"/"false" 문자열을 boolean으로 변환합니다.
 */
export function normalizeBoolean(raw: unknown): boolean | undefined {
  if (typeof raw === "boolean") {
    return raw;
  }

  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return undefined;
}

/**
 * 숫자 값을 정규화합니다.
 * number, 숫자 문자열을 number로 변환합니다.
 */
export function normalizeNumber(raw: unknown): number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }

  if (typeof raw === "string" && raw.trim().length > 0) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

/**
 * 프로젝트 이름을 포맷팅합니다.
 * 공백, 하이픈, 언더스코어로 구분된 문자열을 PascalCase로 변환합니다.
 * 특수문자가 포함된 경우 원본을 반환합니다.
 */
export function formatProjectName(
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/[^a-zA-Z0-9\s_-]/.test(trimmed)) {
    return trimmed;
  }

  const parts = trimmed
    .split(/[\s_-]+/)
    .filter((part) => part.length > 0)
    .map((part) => {
      const firstChar = part[0].toUpperCase();
      const restChars = part.slice(1).toLowerCase();
      return firstChar + restChars;
    });

  if (parts.length === 0) {
    const firstChar = trimmed[0].toUpperCase();
    const restChars = trimmed.slice(1);
    return firstChar + restChars;
  }

  return parts.join("");
}
