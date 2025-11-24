import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { usePortfolioIndex, useProjectMdx } from "../../entities/project";
import { LoadingSpinner, ErrorMessage } from "../../components/common";
import { useMdxContent } from "./hooks/useMdxContent";
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
  const { MDXComponent, error: mdxError } = useMdxContent(mdxSource);

  if (!portfolioIndex) {
    return <LoadingSpinner />;
  }

  const project = useMemo(() => {
    return portfolioIndex.all.find((p) => p.slug === slug);
  }, [portfolioIndex, slug]);

  if (!project) {
    return <ErrorMessage message={MESSAGE_CONSTANTS.NOT_FOUND_MESSAGE} />;
  }

  if (mdxError) {
    return <ErrorMessage message={`MDX 처리 에러: ${mdxError.message}`} />;
  }

  return (
    <>
      <ProjectSEO project={project} />
      <article className="max-w-4xl mx-auto">
        <ProjectHeader project={project} />
        <ProjectCover project={project} />
        <ProjectContent MDXComponent={MDXComponent} />
      </article>
    </>
  );
}
