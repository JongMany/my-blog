import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getEconomies } from "@/service/economy";
import {
  filterAndSortByDate,
  filterPublishedItems,
  extractDateFromMeta,
  formatDate,
} from "@/utils/date";
import { Item, EconomyMeta } from "@/types/contents/economy";
import { ViewCount } from "@/components/view-count";

export default function EconomyPage() {
  const economies = getEconomies();

  // published가 true인 콘텐츠만 필터링하고 최신순으로 정렬
  const sortedEconomies = useMemo(() => {
    return filterAndSortByDate(economies, {
      filters: [filterPublishedItems],
    });
  }, [economies]);

  return (
    <div className="max-w-2xl">
      {sortedEconomies.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          경제 관련 콘텐츠가 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedEconomies.map((economy) => (
            <EconomyItem key={economy.slug} economy={economy} />
          ))}
        </div>
      )}
    </div>
  );
}

const EconomyItem = ({ economy }: { economy: Item<EconomyMeta> }) => {
  const dateStr = extractDateFromMeta(economy.meta);
  const navigate = useNavigate();

  return (
    <article
      key={economy.slug}
      className="cursor-pointer"
      onClick={() => navigate(`/${economy.slug}`)}
    >
      <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        {economy.meta.title}
      </h2>
      {economy.meta.summary && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {economy.meta.summary}
        </p>
      )}
      <div className="flex items-center gap-3">
        {dateStr && (
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <time dateTime={dateStr}>{formatDate(dateStr)}</time>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
          <ViewCount path={`/my-blog/${economy.slug}`} />
          <span>views</span>
        </div>
      </div>
    </article>
  );
};
