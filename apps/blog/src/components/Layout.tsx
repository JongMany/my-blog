// apps/blog/src/components/Layout.tsx
import * as React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogIndexFromHost } from "../service/blogData";

function pill(isActive: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm whitespace-nowrap",
    "transition border",
    isActive
      ? "bg-[var(--primary)] text-[var(--primary-ink)] border-[var(--primary)]"
      : "border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]",
  ].join(" ");
}

export default function BlogLayout({ children }: React.PropsWithChildren) {
  const { data, isLoading } = useQuery({
    queryKey: ["blogIndex"],
    queryFn: fetchBlogIndexFromHost,
    staleTime: 60_000,
  });

  return (
    <div className="space-y-6">
      {/* 상단: 카테고리 바 + 작성 버튼 */}
      <div className="flex items-center justify-between gap-3">
        {/* 카테고리 바 */}
        <div className="overflow-x-auto">
          <div className="flex gap-2">
            {/* 전체 → /blog (index) */}
            <NavLink
              to="/blog"
              end
              className={({ isActive }) => pill(isActive)}
            >
              전체
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
                {isLoading ? "…" : (data?.all.length ?? 0)}
              </span>
            </NavLink>

            {/* 카테고리들 */}
            {!isLoading &&
              data?.categories.map((c) => {
                const count = data.byCategory[c]?.length ?? 0;
                return (
                  <NavLink
                    key={c}
                    to={`/blog/c/${encodeURIComponent(c)}`}
                    className={({ isActive }) => pill(isActive)}
                  >
                    {c}
                    <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
                      {count}
                    </span>
                  </NavLink>
                );
              })}
          </div>
        </div>

        {/* 새 글 쓰기 버튼 (필요 없으면 제거해도 됨) */}
        {/* <Link
          to="/blog/write"
          className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm hover:bg-[var(--hover-bg)]"
        >
          새 글 쓰기
        </Link> */}
      </div>

      {/* 본문 카드 */}
      <div className="t-card p-5">
        <Outlet />
      </div>
    </div>
  );
}
