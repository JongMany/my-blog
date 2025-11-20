import { use, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getBook } from "../../service/books";
import { serialize } from "../../utils/mdx";
import { MDX } from "../../components/mdx";
import Time from "../../components/time";
import Summary from "../../components/summary";

export default function BookDetailPage() {
  const { slug } = useParams();
  const book = getBook(slug ?? "");
  if (!book) {
    return <div>Book not found</div>;
  }

  const { content } = book;
  const { title, summary, updatedAt } = book.meta;

  // Promise를 메모이제이션하여 안정적인 참조 유지
  const serializedPromise = useMemo(() => serialize(content), [content]);
  const { compiledSource } = use(serializedPromise);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <article className="w-full">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <div className="flex flex-col items-start gap-2 mb-8">
          <Time date={updatedAt!} />
          {summary && <Summary>{summary}</Summary>}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
          <MDX compiledSource={compiledSource} frontmatter={book.meta} />
        </div>
      </article>
    </div>
  );
}
