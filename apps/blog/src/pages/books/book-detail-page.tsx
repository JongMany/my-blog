import { useParams } from "react-router-dom";
import { getBook } from "@/service/books";
import { useSerializedMDX } from "@/hooks/use-serialized-mdx";
import { MDX } from "@/components/mdx";
import Title from "@/components/title";
import Time from "@/components/time";
import Summary from "@/components/summary";
import TableOfContents from "@/components/table-of-contents";
import { GiscusComments } from "@/components/giscus-comments";
import NotFoundPage from "@/components/not-found-page";
import { ViewCount } from "@/components/view-count";

export default function BookDetailPage() {
  const { slug } = useParams();
  const book = getBook(slug ?? "");
  if (!book) {
    return <NotFoundPage />;
  }

  const { content } = book;
  const { title, summary, updatedAt } = book.meta;

  const { compiledSource } = useSerializedMDX(content);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative">
      <div className="flex justify-center">
        <article className="w-full max-w-2xl">
          <Title title={title} />
          {summary && (
            <Summary className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              {summary}
            </Summary>
          )}
          <div className="flex items-center gap-2 mb-8">
            {updatedAt && (
              <Time
                date={updatedAt}
                className="text-xs text-gray-500 dark:text-gray-500"
              />
            )}
            <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
              <ViewCount path={`/my-blog/blog/books/${slug}`} />
              <span>views</span>
            </div>
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
            <MDX compiledSource={compiledSource} frontmatter={book.meta} />
          </div>
          <div className="mt-12">
            <GiscusComments term={slug ?? ""} />
          </div>
        </article>
      </div>
      <div className="absolute top-8 right-0 xl:block hidden">
        <TableOfContents />
      </div>
    </div>
  );
}
