import * as React from "react";
import { useParams, Link } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { useQuery } from "@tanstack/react-query";

import {
  useBlogIndex,
  fetchPostMdxFromHost,
  type BlogIndex,
} from "../../service/blogData";

// MDX 런타임 렌더링용
import { compile, evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

function usePost(category: string, slug: string) {
  // 인덱스에서 해당 포스트 찾기
  const { data } = useBlogIndex();
  const post = React.useMemo(() => {
    if (!data) return null;
    return (data as BlogIndex).all.find(
      (p) => p.category === category && p.slug === slug
    );
  }, [data, category, slug]);
  return post;
}

export default function PostPage() {
  const { category = "", slug = "" } = useParams();
  const post = usePost(category, slug);

  // MDX 원문 가져오기
  const mdxQuery = useQuery({
    queryKey: ["blog", "mdx", post?.path ?? null],
    queryFn: () => post?.path && fetchPostMdxFromHost(post.path),
    staleTime: 0,
    enabled: !!post,
  });
  // MDX 컴파일 → 리액트 컴포넌트로 평가
  const [MDXComp, setMDXComp] = React.useState<React.ComponentType | null>(
    null
  );

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!mdxQuery.data) return;
      const file = await compile(mdxQuery.data, {
        remarkPlugins: [remarkGfm],
        outputFormat: "function-body", // v3 권장
      });
      const { default: MDXContent } = await evaluate(String(file), {
        ...runtime,
      });
      if (!cancelled) setMDXComp(() => MDXContent as React.ComponentType);
    })();
    return () => {
      cancelled = true;
    };
  }, [mdxQuery.data]);

  // 포스트가 없으면 404 스타일
  if (!post) {
    return (
      <div className="prose prose-invert max-w-none">
        <h2>글을 찾을 수 없어요</h2>
        <p>
          존재하지 않는 글이거나 인덱스가 최신이 아닐 수 있어요.{" "}
          <Link to="/blog/all">전체 목록</Link>으로 돌아가 확인해 주세요.
        </p>
      </div>
    );
  }

  if (mdxQuery.isLoading) return <p>글을 불러오는 중…</p>;
  if (mdxQuery.isError)
    return (
      <p className="text-red-300">
        MDX 로드 에러: {(mdxQuery.error as Error).message}
      </p>
    );

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="mb-2">{post.title}</h1>
      <p className="mt-0 text-sm opacity-70">
        {post.category} · 작성 {new Date(post.date).toLocaleDateString()} · 수정{" "}
        {new Date(post.updatedAt).toLocaleDateString()}
      </p>

      {MDXComp ? <MDXComp /> : <p>렌더링 준비 중…</p>}
    </article>
  );
}
