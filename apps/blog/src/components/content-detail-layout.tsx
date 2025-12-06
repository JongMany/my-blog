import { useParams, useLocation, Link } from "react-router-dom";
import type { BaseMeta, ContentItem } from "@/types/contents/common";
import { extractDateFromMeta, formatDate } from "@mfe/shared";
import { getImageSource } from "../utils/get-image-source";
import { useSerializedMDX } from "@/hooks/use-serialized-mdx";
import { BlogMDX } from "@/components/mdx/blog-mdx";
import TableOfContents from "@/components/table-of-contents";
import Title from "@/components/title";
import Summary from "@/components/summary";
import { Time, NotFoundSection } from "@srf/ui";
import { GiscusComments } from "@/components/giscus-comments";
import { ViewCount } from "@/components/view-count";
import { SEO, ArticleJsonLd, BreadcrumbJsonLd } from "@srf/ui";

interface ContentDetailLayoutProps<T extends BaseMeta> {
  /**
   * 특정 ID로 아이템을 가져오는 함수
   */
  getItem: (id: string) => ContentItem<T> | undefined;
  /**
   * ViewCount 경로에 사용되는 카테고리명 (예: "posts", "economy")
   */
  category: string;
  /**
   * 메타 영역에 추가 콘텐츠를 렌더링할 수 있습니다.
   */
  renderMeta?: (item: ContentItem<T>) => React.ReactNode;
  /**
   * 콘텐츠 영역에 추가 콘텐츠를 렌더링할 수 있습니다 (MDX 이전).
   */
  renderBeforeContent?: (item: ContentItem<T>) => React.ReactNode;
  /**
   * 콘텐츠 영역에 추가 콘텐츠를 렌더링할 수 있습니다 (MDX 이후).
   */
  renderAfterContent?: (item: ContentItem<T>) => React.ReactNode;
}

/**
 * 콘텐츠 상세 페이지의 공통 레이아웃 컴포넌트입니다.
 *
 * 각 카테고리에서 기본 레이아웃을 그대로 사용하거나,
 * render props를 통해 필요한 부분만 커스터마이징할 수 있습니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <ContentDetailLayout getItem={getPost} category="posts" />
 *
 * // 저자 정보 추가 (책 카테고리)
 * <ContentDetailLayout
 *   getItem={getBook}
 *   category="books"
 *   renderMeta={(book) => (
 *     <span className="text-sm text-gray-500">저자: {book.meta.author}</span>
 *   )}
 * />
 * ```
 */
export function ContentDetailLayout<T extends BaseMeta>({
  getItem,
  category,
  renderMeta,
  renderBeforeContent,
  renderAfterContent,
}: ContentDetailLayoutProps<T>) {
  const { slug } = useParams();
  const item = getItem(slug ?? "");

  if (!item) {
    return (
      <NotFoundSection
        illustrationSrc={getImageSource("/404.svg")}
        renderLink={() => (
          <Link
            to="/blog/posts"
            className="inline-block mt-4 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            블로그로 돌아가기
          </Link>
        )}
      />
    );
  }

  return (
    <ContentDetailView
      item={item}
      category={category}
      slug={slug ?? ""}
      renderMeta={renderMeta}
      renderBeforeContent={renderBeforeContent}
      renderAfterContent={renderAfterContent}
    />
  );
}

// 카테고리별 한글 이름 매핑
const CATEGORY_NAMES: Record<string, string> = {
  posts: "포스트",
  books: "도서 리뷰",
  retrospect: "회고",
  logs: "개발 로그",
  economy: "경제",
};

/**
 * 실제 콘텐츠를 렌더링하는 내부 컴포넌트
 * Hook 규칙을 지키기 위해 분리되었습니다.
 */
function ContentDetailView<T extends BaseMeta>({
  item,
  category,
  slug,
  renderMeta,
  renderBeforeContent,
  renderAfterContent,
}: {
  item: ContentItem<T>;
  category: string;
  slug: string;
  renderMeta?: (item: ContentItem<T>) => React.ReactNode;
  renderBeforeContent?: (item: ContentItem<T>) => React.ReactNode;
  renderAfterContent?: (item: ContentItem<T>) => React.ReactNode;
}) {
  const location = useLocation();
  const { content } = item;
  const { title, summary } = item.meta;
  const { compiledSource } = useSerializedMDX(content);
  const displayDate = extractDateFromMeta(item.meta);

  // SEO 관련 데이터 준비
  const baseUrl = "https://jongmany.github.io/my-blog/blog";
  const currentUrl = `${baseUrl}${location.pathname}`;
  const publishedTime = item.meta.createdAt || item.meta.date || "";
  const modifiedTime = item.meta.updatedAt || publishedTime;
  const tags = item.meta.tags || [];
  const categoryName = CATEGORY_NAMES[category] || category;

  // Breadcrumb 데이터
  const breadcrumbItems = [
    { name: "홈", url: baseUrl },
    { name: categoryName, url: `${baseUrl}/${category}` },
    { name: title, url: currentUrl },
  ];

  return (
    <>
      {/* SEO 메타 태그 */}
      <SEO
        title={title}
        description={summary || `${title} - 이종민 블로그`}
        keywords={tags.join(", ")}
        url={currentUrl}
        type="article"
        siteName="이종민 블로그"
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
      />

      {/* 구조화된 데이터 (JSON-LD) */}
      <ArticleJsonLd
        title={title}
        description={summary || `${title} - 이종민 블로그`}
        url={currentUrl}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        tags={tags}
      />

      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center xl:justify-between xl:gap-8">
          {/* 왼쪽 여백 (xl에서 TOC와 균형을 맞추기 위함) */}
          <div className="hidden xl:block w-64 shrink-0" />

          <article className="w-full max-w-2xl">
            <Title title={title} />
            {summary && (
              <Summary className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                {summary}
              </Summary>
            )}
            <div className="flex items-center gap-2 mb-8">
              {displayDate && (
                <Time
                  date={displayDate}
                  className="text-xs text-gray-500 dark:text-gray-500"
                  formatDate={formatDate}
                />
              )}
              <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                <ViewCount path={`/my-blog/blog/${category}/${slug}`} />
                <span>views</span>
              </div>
              {renderMeta?.(item)}
            </div>
            {renderBeforeContent?.(item)}
            <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
              <BlogMDX
                compiledSource={compiledSource}
                frontmatter={item.meta}
              />
            </div>
            {renderAfterContent?.(item)}
            <div className="mt-12">
              <GiscusComments term={slug} />
            </div>
          </article>

          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
