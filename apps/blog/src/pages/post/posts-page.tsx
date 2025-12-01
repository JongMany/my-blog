import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "@/service/posts";
import { sortByDate, extractDateFromMeta, formatDate } from "@/utils/date";
import { AnalyticsPageData, useAllSiteAnalytics } from "@mfe/shared";
import { Item, PostMeta } from "@/types/contents/post";
import { LoadingSkeleton } from "@srf/ui";

export default function PostsPage() {
  const posts = getPosts();

  // published가 true인 포스트만 필터링하고 최신순으로 정렬
  const sortedPosts = useMemo(() => {
    return sortByDate(posts, true);
  }, [posts]);

  const { loading, error, totals, pageDataList } = useAllSiteAnalytics({
    apiUrl: import.meta.env.VITE_GA_API_URL,
  });

  return (
    <div className="max-w-2xl">
      {sortedPosts.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          포스트가 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <PostItem
              key={post.slug}
              post={post}
              countMeta={{ pageDataList, isCountLoading: loading }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const PostItem = ({
  post,
  countMeta,
}: {
  post: Item<PostMeta>;
  countMeta: { pageDataList?: AnalyticsPageData[]; isCountLoading?: boolean };
}) => {
  const dateStr = extractDateFromMeta(post.meta);
  const navigate = useNavigate();
  const { pageDataList = [], isCountLoading = true } = countMeta;

  const count = useMemo(() => {
    return isCountLoading
      ? 0
      : (pageDataList?.find((pageData) => pageData.path.endsWith(post.slug))
          ?.views ?? 0);
  }, [pageDataList, post.slug, isCountLoading]);

  console.log(count, isCountLoading);

  return (
    <article
      key={post.slug}
      className="cursor-pointer"
      onClick={() => navigate(`/${post.slug}`)}
    >
      <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        {post.meta.title}
      </h2>
      {post.meta.summary && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {post.meta.summary}
        </p>
      )}
      <div className="flex items-center gap-3">
        {dateStr && (
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <time dateTime={dateStr}>{formatDate(dateStr)}</time>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
          {!isCountLoading ? (
            <LoadingSkeleton width="1rem" height="0.75rem" />
          ) : (
            <span>{count}</span>
          )}
          <span>views</span>
        </div>
      </div>
    </article>
  );
};
