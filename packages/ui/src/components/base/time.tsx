import { cn } from "../../utils";
import { formatDate as formatDateUtil } from "@srf/utils";

interface TimeProps {
  /**
   * 표시할 날짜 (Date 객체 또는 ISO 문자열)
   */
  date: Date | string;
  /**
   * time 요소에 적용할 className
   */
  className?: string;
  /**
   * 래퍼 div에 적용할 className
   */
  wrapperClassName?: string;
  /**
   * 날짜 포맷팅 함수
   * 제공되지 않으면 기본 포맷팅을 사용합니다.
   */
  formatDate?: (dateStr: string) => string;
}

/**
 * 날짜 표시 컴포넌트
 *
 * @example
 * ```tsx
 * <Time date="2024-01-01" />
 * <Time date={date} className="text-xs" wrapperClassName="mb-8" />
 * <Time date={date} formatDate={(d) => new Date(d).toLocaleDateString()} />
 * ```
 */
export function Time({
  date,
  className,
  wrapperClassName,
  formatDate,
}: TimeProps) {
  const dateStr = typeof date === "string" ? date : date.toISOString();
  const formattedDate = formatDate
    ? formatDate(dateStr)
    : formatDateUtil(dateStr);

  const timeElement = (
    <time
      dateTime={dateStr}
      className={cn("text-xs text-gray-400", className)}
    >
      {formattedDate}
    </time>
  );

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{timeElement}</div>;
  }

  return timeElement;
}

