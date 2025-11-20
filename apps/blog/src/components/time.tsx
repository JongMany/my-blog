import { format } from "date-fns";

/**
 * @param date - YYYY-MM-DD와 같은 형식으로 들어와야 함.
 */
export default function Time({ date }: { date: Date | string }) {
  const formattedDate = format(new Date(date), "yyyy-MM-dd");

  return (
    <time dateTime={formattedDate} className="text-xs text-gray-400">
      {formattedDate}
    </time>
  );
}
