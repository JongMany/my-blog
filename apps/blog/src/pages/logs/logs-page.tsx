import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getLogs } from "@/service/logs";
import { sortByDate, extractDateFromMeta, formatDate } from "@/utils/date";
import { Item, LogMeta } from "@/types/contents/log";
import { AnalyticsViewCount } from "@/components/analytics-view-count";

export default function LogsPage() {
  const logs = getLogs();

  // published가 true인 로그만 필터링하고 최신순으로 정렬
  const sortedLogs = useMemo(() => {
    return sortByDate(logs, true);
  }, [logs]);

  return (
    <div className="max-w-2xl">
      {sortedLogs.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          로그가 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedLogs.map((log) => (
            <LogItem key={log.slug} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}

const LogItem = ({ log }: { log: Item<LogMeta> }) => {
  const dateStr = extractDateFromMeta(log.meta);
  const navigate = useNavigate();

  return (
    <article
      key={log.slug}
      className="cursor-pointer"
      onClick={() => navigate(`/${log.slug}`)}
    >
      <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        {log.meta.title}
      </h2>
      {log.meta.summary && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {log.meta.summary}
        </p>
      )}
      <div className="flex items-center gap-3">
        {dateStr && (
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <time dateTime={dateStr}>{formatDate(dateStr)}</time>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
          <AnalyticsViewCount pagePath={`/my-blog/${log.slug}`} />
          <span>views</span>
        </div>
      </div>
    </article>
  );
};
