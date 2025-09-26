import { useParams } from "react-router-dom";
import { useMemo } from "react";
import {
  usePortfolioIndex,
  useProjectMdx,
} from "../../service/portfolio.query";
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
  const { data: portfolioIndex } = usePortfolioIndex();

  // 프로젝트 정보 조회
  const project = useMemo(() => {
    return portfolioIndex?.all.find((p) => p.slug === slug);
  }, [portfolioIndex, slug]);

  // MDX 데이터 조회
  const mdxQuery = useProjectMdx(project?.path ?? null);

  // MDX 콘텐츠 처리
  const {
    MDXComponent,
    isLoading: isMdxLoading,
    error: mdxError,
  } = useMdxContent(mdxQuery.data ?? null);

  // 에러 처리
  if (!project) {
    return <ErrorMessage message={MESSAGE_CONSTANTS.NOT_FOUND_MESSAGE} />;
  }

  if (mdxQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (mdxQuery.isError) {
    return (
      <ErrorMessage
        message={`로드 에러: ${(mdxQuery.error as Error).message}`}
      />
    );
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
        <ProjectContent MDXComponent={MDXComponent} isLoading={isMdxLoading} />
      </article>
    </>
  );
}
