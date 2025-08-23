import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listPosts } from "../../service/api";

export default function Home() {
  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: listPosts,
  });
  const latest = posts.slice(0, 5);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3 mt-2">최근 글</h3>
      {latest.length === 0 ? (
        <p className="text-sm text-[var(--muted-fg)]">
          아직 글이 없습니다. 오른쪽 상단의 “새 글 쓰기”로 시작해 보세요.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {latest.map((p) => (
            <li key={p.id} className="py-3">
              <Link
                to={`/blog/post/${p.id}`}
                className="font-medium hover:underline"
              >
                {p.title}
              </Link>
              <div className="mt-1 text-xs text-[var(--muted-fg)]">
                {new Date(p.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pt-2">
        <Link
          to="/blog/posts"
          className="inline-block rounded-md border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm hover:bg-[var(--hover-bg)]"
        >
          전체 글 보기 →
        </Link>
      </div>
    </div>
  );
}
