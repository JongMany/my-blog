import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { getLogs } from "../../service/logs";

export default function LogsPage() {
  const logs = getLogs();
  const navigate = useNavigate();

  // published가 true인 로그만 필터링하고 최신순으로 정렬
  const sortedLogs = useMemo(() => {
    const publishedLogs = logs.filter(
      (log) => log.meta.published !== false,
    );

    return publishedLogs.sort((a, b) => {
      const dateA =
        (a.meta.createdAt as string) ||
        (a.meta.updatedAt as string) ||
        a.meta.date ||
        "";
      const dateB =
        (b.meta.createdAt as string) ||
        (b.meta.updatedAt as string) ||
        b.meta.date ||
        "";

      if (!dateA || !dateB) return 0;

      return new Date(dateB).getTime() - new Date(dateA).getTime(); // 최신순
    });
  }, [logs]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "yyyy-MM-dd");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-2xl">
      {sortedLogs.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          로그가 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedLogs.map((log) => {
            const dateStr =
              (log.meta.createdAt as string) ||
              (log.meta.updatedAt as string) ||
              log.meta.date ||
              "";

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
                {dateStr && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    <time dateTime={dateStr}>{formatDate(dateStr)}</time>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
