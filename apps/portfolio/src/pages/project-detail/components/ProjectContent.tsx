import { LoadingSpinner } from "../../../components/common";
import { MDX } from "../../../components/mdx";
import { MESSAGE_CONSTANTS } from "../constants/messages";
import type { ProjectMeta } from "../../../entities/project";

interface ProjectContentProps {
  compiledSource: string | null;
  frontmatter?: ProjectMeta;
}

export function ProjectContent({
  compiledSource,
  frontmatter,
}: ProjectContentProps) {
  return (
    <div className="prose prose-neutral prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
      {compiledSource ? (
        <MDX compiledSource={compiledSource} frontmatter={frontmatter} />
      ) : (
        <LoadingSpinner message={MESSAGE_CONSTANTS.MDX_RENDER_MESSAGE} />
      )}
    </div>
  );
}
