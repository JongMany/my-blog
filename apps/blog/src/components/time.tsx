import { cn } from "@srf/ui";
import { formatDate } from "@/utils/date";

interface TimeProps {
  date: Date | string;
  className?: string;
  wrapperClassName?: string;
}

/**
 * 날짜 표시 컴포넌트
 *
 * @example
 * ```tsx
 * <Time date="2024-01-01" />
 * <Time date={date} className="text-xs" wrapperClassName="mb-8" />
 * ```
 */
export default function Time({ date, className, wrapperClassName }: TimeProps) {
  const dateStr = typeof date === "string" ? date : date.toISOString();
  const formattedDate = formatDate(dateStr);

  const timeElement = (
    <time dateTime={dateStr} className={cn("text-xs text-gray-400", className)}>
      {formattedDate}
    </time>
  );

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{timeElement}</div>;
  }

  return timeElement;
}
