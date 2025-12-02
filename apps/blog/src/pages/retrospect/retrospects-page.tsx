import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getRetrospects } from "@/service/retrospects";
import {
  filterAndSortByDate,
  filterPublishedItems,
  extractDateFromMeta,
  formatDate,
} from "@/utils/date";
import { Item, RetrospectMeta } from "@/types/contents/retrospect";
import { ViewCount } from "@/components/view-count";
import { ContentList } from "@/components/content-list";

export default function RetrospectsPage() {
  const retrospects = getRetrospects();

  // published가 true인 회고만 필터링하고 최신순으로 정렬
  const sortedRetrospects = useMemo(() => {
    return filterAndSortByDate(retrospects, {
      filters: [filterPublishedItems],
    });
  }, [retrospects]);

  return (
    <ContentList
      items={sortedRetrospects}
      emptyMessage="회고가 없습니다."
      itemKey={(retrospect) => retrospect.slug}
      renderItem={(retrospect) => (
        <RetrospectItem retrospect={retrospect} />
      )}
    />
  );
}

const RetrospectItem = ({
  retrospect,
}: {
  retrospect: Item<RetrospectMeta>;
}) => {
  const dateStr = extractDateFromMeta(retrospect.meta);
  const navigate = useNavigate();

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
      <div className="flex items-center gap-3">
        {dateStr && (
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <time dateTime={dateStr}>{formatDate(dateStr)}</time>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
          <ViewCount path={`/my-blog/${retrospect.slug}`} />
          <span>views</span>
        </div>
      </div>
    </article>
  );
};
