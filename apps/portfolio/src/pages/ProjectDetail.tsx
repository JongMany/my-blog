import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "../components/layout";
import { SEO } from "@srf/ui";
import {
  usePortfolioIndex,
  fetchProjectMdxFromHost,
  getThumbnailPath,
} from "../service/portfolio";
import { evaluate, UseMdxComponents } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { components, MDXTheme } from "../components/mdx-theme";
import { useMemo, useState, useEffect } from "react";
import { imageSource } from "@mfe/shared";

// evaluate에 주입할 훅
const useMDXComponents: UseMdxComponents = () => ({
  ...components,
});

function sanitize(src: string) {
  return src
    .replace(/^\uFEFF/, "") // BOM 제거
    .replace(/\r\n/g, "\n") // CRLF → LF
    .replace(/{{/g, "\\{\\{") // 템플릿 더블 중괄호 방어
    .replace(/}}/g, "\\}\\}");
}

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const { data: portfolioIndex } = usePortfolioIndex();

  const project = useMemo(() => {
    return portfolioIndex?.all.find((p) => p.slug === slug);
  }, [portfolioIndex, slug]);

  const mdxQuery = useQuery({
    queryKey: ["portfolio", "mdx", project?.path ?? null],
    queryFn: () => project?.path && fetchProjectMdxFromHost(project.path),
    enabled: !!project,
  });

  const [MDXComp, setMDXComp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!mdxQuery.data) return;
      try {
        const src = sanitize(mdxQuery.data);
        const { default: MDXContent } = await evaluate(src, {
          ...runtime,
          useMDXComponents,
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
          ],
        });
        if (!cancelled) setMDXComp(() => MDXContent as React.ComponentType);
      } catch (err: any) {
        if (import.meta.env.DEV) {
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mdxQuery.data]);

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="text-lg text-[var(--muted-fg)]">
            존재하지 않는 프로젝트입니다.
          </div>
        </div>
      </Layout>
    );
  }

  if (mdxQuery.isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-[var(--muted-fg)]">로딩 중...</div>
        </div>
      </Layout>
    );
  }

  if (mdxQuery.isError) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="text-lg text-[var(--muted-fg)]">
            로드 에러: {(mdxQuery.error as Error).message}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={project.title}
        description={project.summary}
        keywords={project.tags.join(", ")}
        url={`https://jongmany.github.io/my-blog/portfolio/project/${project.slug}`}
        type="article"
        image={
          project.cover
            ? `https://jongmany.github.io/my-blog/portfolio${getThumbnailPath(project.cover)}`
            : undefined
        }
      />
      <article className="max-w-4xl mx-auto">
        {/* 프로젝트 헤더 */}
        <header className="mb-8">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            {project.project && (
              <span className="t-chip text-sm">{project.project}</span>
            )}
          </div>

          <p className="text-lg text-[var(--muted-fg)] mb-4">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="t-chip">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* 커버 이미지 */}
        {project.cover && (
          <div className="mb-8">
            <img
              src={imageSource(
                project.cover,
                "portfolio",
                "http://localhost:3002",
              )}
              alt={project.coverAlt || project.title}
              className="w-full h-auto rounded-lg"
            />
            {project.coverCaption && (
              <p className="text-sm text-[var(--muted-fg)] mt-2 text-center">
                {project.coverCaption}
              </p>
            )}
          </div>
        )}

        {/* MDX 콘텐츠 */}
        <div className="prose prose-lg max-w-none">
          {MDXComp ? (
            <MDXTheme>
              <MDXComp />
            </MDXTheme>
          ) : (
            <div className="text-center py-8">
              <div className="text-[var(--muted-fg)]">렌더링 준비 중...</div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
}
