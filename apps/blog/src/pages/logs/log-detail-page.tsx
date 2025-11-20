import { use, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getLog } from "../../service/logs";
import { serialize } from "../../utils/mdx";
import { extractDateFromMeta, formatDate } from "../../utils/date";
import { MDX } from "../../components/mdx";
import TableOfContents from "../../components/table-of-contents";

export default function LogDetailPage() {
  const { slug } = useParams();
  const log = getLog(slug ?? "");
  if (!log) {
    return <div>Log not found</div>;
  }

  const { content } = log;
  const { title, summary } = log.meta;

  // Promise를 메모이제이션하여 안정적인 참조 유지
  const serializedPromise = useMemo(() => serialize(content), [content]);
  const { compiledSource } = use(serializedPromise);

  const displayDate = extractDateFromMeta(log.meta);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative">
      <div className="flex justify-center">
        <article className="w-full max-w-2xl">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {summary && (
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              {summary}
            </p>
          )}
          {displayDate && (
            <div className="mb-8 text-xs text-gray-500 dark:text-gray-500">
              <time dateTime={displayDate}>{formatDate(displayDate)}</time>
            </div>
          )}
          <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
            <MDX compiledSource={compiledSource} frontmatter={log.meta} />
          </div>
        </article>
      </div>
      <div className="absolute top-8 right-0 xl:block hidden">
        <TableOfContents />
      </div>
    </div>
  );
}
