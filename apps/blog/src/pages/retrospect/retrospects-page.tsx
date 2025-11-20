import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { getRetrospects } from "../../service/retrospects";

export default function RetrospectsPage() {
  const retrospects = getRetrospects();
  const navigate = useNavigate();

  // published가 true인 회고만 필터링하고 최신순으로 정렬
  const sortedRetrospects = useMemo(() => {
    const publishedRetrospects = retrospects.filter(
      (retrospect) => retrospect.meta.published !== false,
    );

    return publishedRetrospects.sort((a, b) => {
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
  }, [retrospects]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "yyyy-MM-dd");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-2xl">
      {sortedRetrospects.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          회고가 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedRetrospects.map((retrospect) => {
            const dateStr =
              (retrospect.meta.createdAt as string) ||
              (retrospect.meta.updatedAt as string) ||
              retrospect.meta.date ||
              "";

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
