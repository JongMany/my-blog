import { DateComparable, extractDateFromMeta, compareByDate } from "@mfe/shared";

/**
 * 날짜에서 년도와 월을 추출합니다.
 *
 * @param dateStr - 날짜 문자열
 * @returns 년도와 월 객체, 유효하지 않은 날짜면 null
 *
 * @example
 * ```ts
 * const { year, month } = extractYearMonth("2024-01-15");
 * // { year: "2024", month: "1" }
 * ```
 */
export function extractYearMonth(dateStr: string | undefined): { year: string; month: string } | null {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;

  return {
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString(),
  };
}

/**
 * 아이템들을 년도와 월별로 그룹화합니다.
 *
 * @param items - 그룹화할 아이템 배열
 * @param getDate - 아이템에서 날짜를 추출하는 함수
 * @returns 년도별, 월별로 그룹화된 객체
 *
 * @example
 * ```ts
 * const grouped = groupByYearMonth(items, (item) => item.meta.date);
 * // { "2024": { "1": [item1, item2], "2": [item3] } }
 * ```
 */
export function groupByYearMonth<T>(
  items: T[],
  getDate: (item: T) => string | undefined,
): Record<string, Record<string, T[]>> {
  const grouped: Record<string, Record<string, T[]>> = {};

  items.forEach((item) => {
    const dateStr = getDate(item);
    const yearMonth = extractYearMonth(dateStr);
    if (!yearMonth) return;

    const { year, month } = yearMonth;

    if (!grouped[year]) {
      grouped[year] = {};
    }
    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }
    grouped[year][month].push(item);
  });

  return grouped;
}

/**
 * 그룹화된 데이터를 년도와 월 기준으로 정렬합니다.
 * 최신순으로 정렬됩니다.
 *
 * @param grouped - 그룹화된 데이터
 * @param sortItems - 각 그룹 내 아이템 정렬 함수 (선택사항)
 * @returns 정렬된 그룹 배열
 *
 * @example
 * ```ts
 * const sorted = sortGroupedByYearMonth(grouped, compareByDate);
 * ```
 */
export function sortGroupedByYearMonth<T>(
  grouped: Record<string, Record<string, T[]>>,
  sortItems?: (a: T, b: T) => number,
): Array<{
  year: string;
  months: Array<{
    month: string;
    items: T[];
  }>;
}> {
  return Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a)) // 최신년도부터
    .map((year) => {
      const months = Object.keys(grouped[year])
        .sort((a, b) => Number(b) - Number(a)) // 최신월부터
        .map((month) => {
          const items = sortItems
            ? [...grouped[year][month]].sort(sortItems)
            : grouped[year][month];

          return {
            month,
            items,
          };
        });

      return { year, months };
    });
}

/**
 * 월 번호를 월 이름으로 변환합니다.
 *
 * @param month - 월 번호 문자열 (1-12)
 * @param format - 포맷 함수 (기본값: "N월" 형식)
 * @returns 포맷된 월 이름
 *
 * @example
 * ```ts
 * formatMonthName("1"); // "1월"
 * formatMonthName("12", (n) => `${n}월`); // "12월"
 * ```
 */
export function formatMonthName(
  month: string,
  format: (monthNum: number) => string = (n) => `${n}월`,
): string {
  const monthNum = Number(month);
  return format(monthNum);
}

