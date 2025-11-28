import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getRetrospects } from "@/service/retrospects";
import { sortByDate, extractDateFromMeta, formatDate } from "@/utils/date";

export default function RetrospectsPage() {
  const retrospects = getRetrospects();
  const navigate = useNavigate();

  // published가 true인 회고만 필터링하고 최신순으로 정렬
  const sortedRetrospects = useMemo(() => {
    return sortByDate(retrospects, true);
  }, [retrospects]);

  return (
    <div className="max-w-2xl">
      {sortedRetrospects.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          회고가 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedRetrospects.map((retrospect) => {
            const dateStr = extractDateFromMeta(retrospect.meta);

            return (
              <article
                key={retrospect.slug}
                className="cursor-pointer"
                onClick={() => navigate(`/${retrospect.slug}`)}
              >
                <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  {retrospect.meta.title}
                </h2>
                {retrospect.meta.summary && (
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    {retrospect.meta.summary}
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
