import { useParams } from "react-router-dom";
import { getLog } from "@/service/logs";
import { extractDateFromMeta } from "@/utils/date";
import { useSerializedMDX } from "@/hooks/use-serialized-mdx";
import { MDX } from "@/components/mdx";
import TableOfContents from "@/components/table-of-contents";
import Title from "@/components/title";
import Summary from "@/components/summary";
import Time from "@/components/time";
import { GiscusComments } from "@/components/giscus-comments";

export default function LogDetailPage() {
  const { slug } = useParams();
  const log = getLog(slug ?? "");
  if (!log) {
    return <div>Log not found</div>;
  }

  const { content } = log;
  const { title, summary } = log.meta;

  const { compiledSource } = useSerializedMDX(content);

  const displayDate = extractDateFromMeta(log.meta);

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
          {displayDate && (
            <Time
              date={displayDate}
              className="text-xs text-gray-500 dark:text-gray-500"
              wrapperClassName="mb-8"
            />
          )}
          <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
            <MDX compiledSource={compiledSource} frontmatter={log.meta} />
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
