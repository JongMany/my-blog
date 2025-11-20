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
    <div className="w-full max-w-3xl">
      <article className="prose prose-neutral w-full max-w-none break-all dark:prose-invert">
        <h1 className="m-0 py-4">{title}</h1>
        <div className="flex flex-col items-start gap-1">
          <Summary>{summary}</Summary>
          <div className="flex items-center justify-start gap-2">
            <Time date={updatedAt!} />
            {/* <Bullet /> */}
            {/* <ReadingTime readingTime={readingTime} /> */}
            {/* <Bullet /> */}
            {/* <Views slug={slug} increase /> */}
          </div>
        </div>
        <div className="w-full py-8">
          <MDX compiledSource={compiledSource} frontmatter={book.meta} />
        </div>
      </article>
    </div>
  );
}
