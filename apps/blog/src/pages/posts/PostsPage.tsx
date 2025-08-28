// PostPage.tsx
import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// ⬇️ 추가
import { MDXProvider } from "@mdx-js/react";
import type { ComponentProps } from "react";

import {
  useBlogIndex,
  fetchPostMdxFromHost,
  type BlogIndex,
} from "../../service/blogData";

// ⬇️ 추가: MDX 컴포넌트 오버라이드(스타일링)
type ComponentsProp = ComponentProps<typeof MDXProvider>["components"];
const components: NonNullable<ComponentsProp> = {
  a: (props) => (
    <a {...props} className="text-sky-400 underline-offset-4 hover:underline" />
  ),
  img: (props) => (
    <img
      {...props}
      className="rounded-lg border border-white/10"
      loading="lazy"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="rounded-lg border border-white/10 p-4 overflow-x-auto"
    />
  ),
  code: (props) => <code {...props} className="rounded px-1 py-0.5" />,
};

// ⬇️ 추가: evaluate에 주입할 훅(버전 상관없이 오버라이드가 먹도록)
const useMDXComponents = (existing?: any) => ({
  ...(existing || {}),
  ...components,
});

function sanitize(src: string) {
  return src
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/{{/g, "\\{\\{")
    .replace(/}}/g, "\\}\\}");
}

export default function PostPage() {
  const { category = "", slug = "" } = useParams();
  const { data } = useBlogIndex();
  const post = React.useMemo(
    () =>
      data?.all.find((p) => p.category === category && p.slug === slug) ?? null,
    [data, category, slug],
  );

  const mdxQuery = useQuery({
    queryKey: ["blog", "mdx", post?.path ?? null],
    queryFn: () => post?.path && fetchPostMdxFromHost(post.path),
    enabled: !!post,
  });

  const [MDXComp, setMDXComp] = React.useState<React.ComponentType | null>(
    null,
  );

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!mdxQuery.data) return;
      try {
        const src = sanitize(mdxQuery.data);
        const { default: MDXContent } = await evaluate(src, {
          ...runtime,
          // ⬇️ 추가: 컴포넌트 오버라이드가 항상 적용되도록
          useMDXComponents,
          // 참고: v3에선 remark/rehype는 compile 단계 권장이지만,
          // 여기서는 evaluate 옵션으로 둬도 동작하는 환경이면 그대로 사용
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
          ],
        });
        if (!cancelled) setMDXComp(() => MDXContent as React.ComponentType);
      } catch (err: any) {
        console.error("[MDX evaluate error]", err?.message, err?.position);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mdxQuery.data]);

  if (!post) return <p>글을 찾을 수 없어요.</p>;
  if (mdxQuery.isLoading) return <p>불러오는 중…</p>;
  if (mdxQuery.isError)
    return <p>로드 에러: {(mdxQuery.error as Error).message}</p>;

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="mb-2">{post.title}</h1>
      <p className="mt-0 text-sm opacity-70">
        {post.category} · 작성 {new Date(post.date).toLocaleDateString()} · 수정{" "}
        {new Date(post.updatedAt).toLocaleDateString()}
      </p>

      {/* ⬇️ 여기서 MDXProvider로 감싸면 끝! */}
      {MDXComp ? (
        <MDXProvider components={components}>
          <MDXComp />
        </MDXProvider>
      ) : (
        <p>렌더링 준비 중…</p>
      )}
    </article>
  );
}
