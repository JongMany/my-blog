import * as React from "react";
import { Link } from "react-router-dom";

import { useBlogIndex } from "../../service/blogData"; // 이미 있는 훅 사용
import { assetUrl } from "@mfe/shared";

// type Post = ReturnType<typeof useBlogIndex>["data"]["all"][number];
type Post = any;

function thumbSrc(p: Post) {
  // cover가 있으면 블로그 리모트 기준 URL 생성
  return p.cover ? assetUrl(p.cover, "blog") : null;
}

function PostCard({ p }: { p: Post }) {
  const src = thumbSrc(p);

  return (
    <Link
      to={`/blog/${p.category}/${p.slug}`}
      className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      {/* 썸네일 영역 */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/[0.04]">
        {src ? (
          <img
            src={src}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl opacity-50">
            📝
          </div>
        )}
        {/* 카테고리 뱃지 */}
        <span className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur">
          {p.category}
        </span>
      </div>

      {/* 텍스트 영역 */}
      <div className="p-4">
        <div className="line-clamp-1 text-base font-medium">{p.title}</div>
        <div className="mt-1 text-xs text-white/60">
          작성 {new Date(p.date).toLocaleDateString()} · 수정{" "}
          {new Date(p.updatedAt).toLocaleDateString()}
        </div>
        {p.summary && (
          <p className="mt-2 line-clamp-2 text-sm text-white/80">{p.summary}</p>
        )}
        <div className="mt-3 inline-flex items-center text-sm text-white/80">
          더보기{" "}
          <span className="ml-1 transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </Link>
  );
}

export default function Component() {
  const { data, isLoading, isError, error } = useBlogIndex();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl bg-white/[0.06]"
          />
        ))}
      </div>
    );
  }
  if (isError)
    return <p className="text-red-300">에러: {(error as Error).message}</p>;
  if (!data) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.all.map((p) => (
        <PostCard key={`${p.category}/${p.slug}`} p={p} />
      ))}
    </div>
  );
}
