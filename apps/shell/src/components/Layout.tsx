import { useRef, type PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@srf/ui";
import ActivePill from "./ActivePill";

export default function Layout({ children }: PropsWithChildren) {
  const navRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mx-auto max-w-screen-2xl px-5 pt-8 pb-16">
      <HeroBackdrop />

      {/* AppBar */}
      {/* <header className="mb-8 flex items-center gap-3">
        <div className="mr-2 text-xl font-semibold tracking-tight">My Site</div>
        <nav className="flex gap-1 rounded-full border border-[var(--border)] bg-[var(--card-bg)] p-1">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/blog", label: "Blog" },
            { to: "/portfolio", label: "Portfolio" },
            { to: "/resume", label: "Resume" },
          ].map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={(n as any).end}
              // className={({ isActive }) =>
              //   [
              //     "rounded-full px-3 py-1.5 text-sm transition",
              //     isActive
              //       ? "bg-[var(--primary)] text-[var(--primary-ink)]"
              //       : "text-[var(--fg)] hover:bg-[var(--hover-bg)]",
              //   ].join(" ")
              // }
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  isActive
                    ? "bg-blue-9 text-white-1"
                    : "text-white-12 hover:bg-[var(--hover-bg)]"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a href="/blog/write" className="t-btn t-btn--primary text-sm">
            새 글 쓰기
          </a>
        </div>
      </header> */}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 t-btn text-xs"
      >
        본문으로 건너뛰기
      </a>

      <header className="mb-8 flex items-center gap-3">
        <div className="mr-2 text-xl font-semibold tracking-tight">My Site</div>

        {/* NAV with active pill */}
        <div
          ref={navRef}
          className="relative z-0 flex gap-1 rounded-full border border-[var(--border)] bg-[var(--card-bg)] p-1"
        >
          <ActivePill containerRef={navRef} />
          {[
            { to: "/", label: "Home", end: true },
            { to: "/blog", label: "Blog" },
            { to: "/portfolio", label: "Portfolio" },
            { to: "/resume", label: "Resume" },
          ].map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={(n as any).end}
              className={({ isActive }) =>
                cn(
                  "relative z-10 rounded-full px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                  isActive ? "text-gray-1" : ""
                )
              }
              // data-active 속성으로 활성 링크 표식
              children={({ isActive }) => (
                <span data-active={isActive ? "true" : undefined}>
                  {n.label}
                </span>
              )}
            />
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link to="/blog/write" className="t-btn t-btn--primary text-sm">
            새 글 쓰기
          </Link>
        </div>
      </header>
      <main className="relative z-10">{children}</main>

      <footer className="mt-14 text-sm text-[var(--muted-fg)]">
        © {new Date().getFullYear()} · Vite + Module Federation
      </footer>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <>
      {/* 라디얼 스포트라이트 */}
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_0%,rgb(99_102_241_/_0.25),transparent_60%)]" />
      {/* 도트 그리드 */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px]" />
      {/* 그라디언트 블롭 */}
      <div className="pointer-events-none absolute left-1/2 top-[-80px] -z-10 size-[520px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-sky-400/20 to-emerald-400/20 blur-3xl" />
    </>
  );
}
