import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { evaluate, UseMdxComponents } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { useBlogIndex, fetchPostMdxFromHost } from "../../service/blogData";
import { MDXTheme } from "../../components/mdx";
import { components } from "../../components/mdx/MDXTheme";
import { Comments as Giscus } from "../../components/comments";

// evaluate에 주입할 훅(버전 상관없이 오버라이드가 먹도록)
const useMDXComponents: UseMdxComponents = () => ({
  ...components,
});

function sanitize(src: string) {
  return src
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/{{/g, "\\{\\{")
    .replace(/}}/g, "\\}\\}");
}

export default function PostDetailPage() {
  const { category = "", slug = "" } = useParams();
  const { data } = useBlogIndex();

  // 해당 포스트 찾기
  const post = React.useMemo(() => {
    if (!data) return null;
    return (
      data.all.find((p) => p.category === category && p.slug === slug) ?? null
    );
  }, [data, category, slug]);

  // MDX 소스 가져오기
  const {
    data: mdxSrc,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["postMdx", category, slug],
    queryFn: () => fetchPostMdxFromHost(`_blog/${category}/${slug}.mdx`),
    enabled: !!post,
  });

  // MDX 컴포넌트로 변환
  const [mdxContent, setMdxContent] = React.useState<React.ReactElement | null>(
    null,
  );

  React.useEffect(() => {
    if (!mdxSrc) {
      setMdxContent(null);
      return;
    }

    const run = async () => {
      try {
        const sanitized = sanitize(mdxSrc);
        const { default: Content } = await evaluate(sanitized, {
          ...runtime,
          useMDXComponents,
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
                properties: {
                  className: ["anchor"],
                },
              },
            ],
          ],
        });
        setMdxContent(<Content />);
      } catch (err) {
        console.error("MDX 평가 실패:", err);
        setMdxContent(null);
      }
    };

    run();
  }, [mdxSrc]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center">
        <p className="text-red-300">에러: {(error as Error).message}</p>
        <Link
          to="/blog"
          className="mt-4 inline-block text-blue-400 hover:underline"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center">
        <p className="text-white/70">포스트를 찾을 수 없습니다.</p>
        <Link
          to="/blog"
          className="mt-4 inline-block text-blue-400 hover:underline"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-6">
      {/* 포스트 헤더 */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Link
            to={`/blog/c/${encodeURIComponent(post.category)}`}
            className="hover:text-white/80 hover:underline"
          >
            #{post.category}
          </Link>
          <span>•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString()}
          </time>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-lg text-white/80">{post.summary}</p>
        )}
      </header>

      {/* 포스트 내용 */}
      <div className="prose prose-invert max-w-none">
        <MDXTheme>{mdxContent}</MDXTheme>
      </div>

      {/* 댓글 */}
      <Giscus term={`${category}/${slug}`} />
    </article>
  );
}
