import { useNavigate } from "react-router-dom";
import type { BaseMeta, ContentItem } from "@/types/contents/common";
import { extractDateFromMeta, formatDate } from "@/utils/date";
import { ViewCount } from "@/components/view-count";

interface ContentListItemProps<T extends BaseMeta> {
  item: ContentItem<T>;
  /**
   * 커스텀 렌더링이 필요할 경우 children으로 추가 콘텐츠를 렌더링할 수 있습니다.
   */
  children?: React.ReactNode;
}

/**
 * 콘텐츠 목록의 개별 아이템을 렌더링하는 공통 컴포넌트입니다.
 * 
 * 각 카테고리에서 기본 스타일을 그대로 사용하거나,
 * 필요시 직접 구현하여 커스터마이징할 수 있습니다.
 * 
 * @example
 * ```tsx
 * // 기본 사용
 * <ContentListItem item={post} />
 * 
 * // 추가 콘텐츠와 함께
 * <ContentListItem item={book}>
 *   <span className="text-sm">저자: {book.meta.author}</span>
 * </ContentListItem>
 * ```
 */
export function ContentListItem<T extends BaseMeta>({
  item,
  children,
}: ContentListItemProps<T>) {
  const dateStr = extractDateFromMeta(item.meta);
  const navigate = useNavigate();

  return (
    <article
      className="cursor-pointer"
      onClick={() => navigate(`/${item.slug}`)}
    >
      <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        {item.meta.title}
      </h2>
      {item.meta.summary && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {item.meta.summary}
        </p>
      )}
      {children}
      <div className="flex items-center gap-3">
        {dateStr && (
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <time dateTime={dateStr}>{formatDate(dateStr)}</time>
          </div>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
          <ViewCount path={`/my-blog/${item.slug}`} />
          <span>views</span>
        </div>
      </div>
    </article>
  );
}

