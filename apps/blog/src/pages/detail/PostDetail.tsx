import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "../../service/api";
import { qk } from "../../service/queryKey";
import { Viewer } from "@toast-ui/react-editor";

export default function PostDetail() {
  const { id = "" } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: qk.post(id),
    queryFn: () => getPost(id),
  });

  // theme 동기화
  const [isLight, setIsLight] = React.useState(
    (document.documentElement.getAttribute("data-theme") ?? "dark") === "light",
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsLight(
        (document.documentElement.getAttribute("data-theme") ?? "dark") ===
          "light",
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  if (isLoading) return <p>Loading…</p>;
  if (!post) return <p>존재하지 않는 글입니다.</p>;

  return (
    <>
      <article className="space-y-4">
        <h1 className="text-2xl font-semibold">{post.title}</h1>

        <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-fg)]">
          {post.categories.map((c) => (
            <Link
              key={c}
              to={`/blog/categories/${c}`}
              className="rounded border border-[var(--border)] px-1.5 py-0.5"
            >
              #{decodeURIComponent(c)}
            </Link>
          ))}
          <span className="ml-auto">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>

        {/* ✅ Toast UI Viewer (마크다운 → HTML 렌더, 코드 하이라이트/테이블 등 깔끔) */}
        <div className="rounded-lg border border-[var(--border)] p-3">
          <Viewer
            initialValue={post.content}
            theme={isLight ? undefined : "dark"}
          />
        </div>
      </article>
    </>
  );
}
