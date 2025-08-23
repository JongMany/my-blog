import { Link, NavLink } from "react-router-dom";

export default function BlogLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <nav className="flex gap-1 rounded-full border border-[var(--border)] bg-[var(--card-bg)] p-1 text-sm">
          {[
            { to: "/blog", label: "Home", end: true },
            { to: "/blog/posts", label: "All Posts" },
            { to: "/blog/categories", label: "Categories" },
            { to: "/blog/write", label: "Write" },
          ].map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={(n as any).end}
              className={({ isActive }) =>
                [
                  "rounded-full px-3 py-1.5 transition",
                  isActive
                    ? "bg-[var(--primary)] text-[var(--primary-ink)]"
                    : "hover:bg-[var(--hover-bg)]",
                ].join(" ")
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/blog/write"
          className="rounded-md border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm hover:bg-[var(--hover-bg)]"
        >
          새 글 쓰기
        </Link>
      </div>

      <div className="t-card p-5">{children}</div>
    </div>
  );
}
