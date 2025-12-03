import { format } from "date-fns";

/**
 * 날짜 메타데이터 타입
 * createdAt, updatedAt, date 중 하나 이상을 포함할 수 있습니다.
 */
export interface DateMeta {
  createdAt?: string | number;
  updatedAt?: string | number;
  date?: string | number;
}

/**
 * 날짜 기준으로 비교 가능한 아이템 타입
 */
export interface DateComparable {
  meta: DateMeta;
}

/**
 * published 필드와 날짜 메타데이터를 모두 가진 아이템 타입
 */
export interface SortableByDate extends DateComparable {
  meta: DateMeta & {
    published?: boolean;
  };
}

/**
 * 메타데이터에서 날짜를 추출합니다.
 * 우선순위: createdAt → updatedAt → date
 *
 * @param meta - 날짜 메타데이터 객체
 * @returns 추출된 날짜 문자열, 없으면 undefined
 *
 * @example
 * ```ts
 * const date = extractDateFromMeta({ createdAt: "2024-01-01", updatedAt: "2024-01-02" });
 * // "2024-01-01"
 * ```
 */
export function extractDateFromMeta(meta: DateMeta): string | undefined {
  if (meta.createdAt) {
    return typeof meta.createdAt === "number"
      ? new Date(meta.createdAt).toISOString()
      : meta.createdAt;
  }

  if (meta.updatedAt) {
    return typeof meta.updatedAt === "number"
      ? new Date(meta.updatedAt).toISOString()
      : meta.updatedAt;
  }

  if (meta.date) {
    return typeof meta.date === "number"
      ? new Date(meta.date).toISOString()
      : meta.date;
  }

  return undefined;
}

/**
 * 날짜 문자열을 yyyy-MM-dd 형식으로 포맷팅합니다.
 * 유효하지 않은 날짜인 경우 원본 문자열을 반환합니다.
 *
 * @param dateStr - 포맷팅할 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (yyyy-MM-dd) 또는 원본 문자열
 *
 * @example
 * ```ts
 * formatDate("2024-01-01T00:00:00Z");
 * // "2024-01-01"
 *
 * formatDate("invalid");
 * // "invalid"
 * ```
 */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return format(date, "yyyy-MM-dd");
  } catch {
    return dateStr;
  }
}

/**
 * 두 아이템을 날짜 기준으로 비교합니다.
 * 최신순으로 정렬하기 위한 비교 함수입니다.
 *
 * @param a - 첫 번째 아이템
 * @param b - 두 번째 아이템
 * @returns 비교 결과 (양수: a가 더 최신, 음수: b가 더 최신, 0: 동일)
 *
 * @example
 * ```ts
 * const items = [...];
 * items.sort(compareByDate);
 * ```
 */
export function compareByDate<T extends DateComparable>(a: T, b: T): number {
  const dateA = extractDateFromMeta(a.meta);
  const dateB = extractDateFromMeta(b.meta);

  if (!dateA && !dateB) return 0;
  if (!dateA) return 1; // dateA가 없으면 뒤로
  if (!dateB) return -1; // dateB가 없으면 앞으로

  return new Date(dateB).getTime() - new Date(dateA).getTime(); // 최신순
}

/**
 * 필터링 및 정렬 옵션
 */
export interface FilterAndSortOptions<T extends SortableByDate> {
  /**
   * 필터 함수 배열
   * 모든 필터 함수가 true를 반환하는 아이템만 포함됩니다.
   * @default [] - 필터 없음
   */
  filters?: Array<(item: T) => boolean>;
}

/**
 * published가 false인 아이템을 필터링하는 기본 필터 함수
 *
 * @param item - 필터링할 아이템
 * @returns published가 false가 아닌 경우 true
 */
export function filterPublishedItems<T extends SortableByDate>(
  item: T,
): boolean {
  return item.meta.published !== false;
}

/**
 * 아이템 리스트를 필터링하고 날짜 기준으로 정렬합니다.
 *
 * @param items - 정렬할 아이템 배열
 * @param options - 필터링 및 정렬 옵션
 * @returns 필터링되고 정렬된 아이템 배열
 *
 * @example
 * ```ts
 * // 필터 없이 정렬만
 * const allPosts = filterAndSortByDate(posts);
 *
 * // published 필터링 적용
 * const sortedPosts = filterAndSortByDate(posts, {
 *   filters: [filterPublishedItems],
 * });
 *
 * // 커스텀 필터 추가
 * const sortedPosts = filterAndSortByDate(posts, {
 *   filters: [
 *     filterPublishedItems,
 *     (item) => item.meta.category === "tech",
 *   ],
 * });
 * ```
 */
export function filterAndSortByDate<T extends SortableByDate>(
  items: T[],
  options: FilterAndSortOptions<T> = {},
): T[] {
  const { filters = [] } = options;
  let filtered = items;

  if (filters.length > 0) {
    filtered = items.filter((item) => filters.every((filter) => filter(item)));
  }

  return filtered.sort(compareByDate);
}
