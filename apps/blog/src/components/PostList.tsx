import { Link } from "react-router-dom";
import type { Post } from "../service/types";

export default function PostList({
  items,
  emptyText = "글이 없습니다.",
}: {
  items: Post[];
  emptyText?: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-[var(--muted-fg)]">{emptyText}</p>;
  }

  return (
    <ul className="grid gap-3">
      {items.map((p) => (
        <li key={p.id} className="t-card p-4 hover:shadow-lg transition-shadow">
          <Link
            to={`/blog/post/${p.id}`}
            className="text-[var(--fg)] hover:underline font-medium"
          >
            {p.title}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-fg)]">
            {p.categories.map((c) => (
              <Link
                key={c}
                to={`/blog/categories/${c}`}
                className="t-chip hover:bg-[var(--hover-bg)]"
              >
                #{decodeURIComponent(c)}
              </Link>
            ))}
            <span className="ml-auto">
              {new Date(p.createdAt).toLocaleString()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
