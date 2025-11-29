import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { usePortfolioIndex, useProjectMdx } from "@/entities/project";
import { LoadingSpinner, ErrorMessage } from "@/components/common";
import { useMdxContent } from "./hooks/use-mdx-content";
import {
  ProjectSEO,
  ProjectHeader,
  ProjectCover,
  ProjectContent,
} from "./components";
import { MESSAGE_CONSTANTS } from "./constants/messages";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const portfolioIndex = usePortfolioIndex();
  const mdxSource = useProjectMdx(slug || null);
  const { compiledSource } = useMdxContent(mdxSource);

  if (!portfolioIndex) {
    return <LoadingSpinner />;
  }

  const project = useMemo(() => {
    return portfolioIndex.all.find((p) => p.slug === slug);
  }, [portfolioIndex, slug]);

  if (!project) {
    return (
      <ErrorMessage
        message={MESSAGE_CONSTANTS.NOT_FOUND_MESSAGE}
        illustrationSrc="/404.svg"
        illustrationAlt="프로젝트를 찾을 수 없음을 나타내는 일러스트"
      />
    );
  }

  return (
    <>
      <ProjectSEO project={project} />
      <article className="max-w-4xl mx-auto">
        <ProjectHeader project={project} />
        <ProjectCover project={project} />
        <ProjectContent compiledSource={compiledSource} frontmatter={project} />
      </article>
    </>
  );
}
