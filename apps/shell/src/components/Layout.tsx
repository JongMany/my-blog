import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BlogTotal, cn } from "@srf/ui";
import ActivePill from "./ActivePill";
import { useGaPageViews } from "../hooks/useGaPageViews";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/blog", label: "Blog" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/resume", label: "Resume" },
];

export default function Layout({ children }: PropsWithChildren) {
  const navRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useGaPageViews(import.meta.env.VITE_GA_MEASUREMENT_ID);
  useEffect(() => setOpen(false), [pathname]);

  // useEffect(() => {
  //   if (!open) return;
  //   const onClick = (e: MouseEvent) => {
  //     const target = e.target as Node;
  //     if (!navRef.current?.contains(target)) setOpen(false);
  //   };
  //   document.addEventListener("mousedown", onClick);
  //   return () => document.removeEventListener("mousedown", onClick);
  // }, [open]);

  const activeLabel =
    NAV.find((n) =>
      n.to === "/"
        ? pathname === "/"
        : pathname === n.to || pathname.startsWith(`${n.to}/`),
    )?.label ?? "Menu";

  return (
    <div className="shell:relative shell:mx-auto shell:max-w-screen-2xl shell:px-5 shell:pt-8 shell:pb-16 shell:min-h-full shell:flex shell:flex-col ">
      <HeroBackdrop />

      <header className="shell:mb-8 shell:flex shell:items-center shell:gap-3">
        <div className="shell:mr-2 shell:text-xl shell:font-semibold shell:tracking-tight">
          My Site
        </div>

        <div
          ref={navRef}
          className="shell:relative shell:z-0 shell:gap-1 shell:rounded-full shell:border shell:border-[var(--border)] shell:bg-[var(--card-bg)] shell:p-1 shell:hidden shell:md:flex"
        >
          <ActivePill containerRef={navRef} />
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={(n as any).end}
              className={({ isActive }) =>
                cn(
                  "shell:relative shell:z-10 shell:rounded-full shell:px-3 shell:py-1.5 shell:text-sm shell:transition shell:focus:outline-none shell:focus-visible:ring-2 shell:focus-visible:ring-[var(--primary)]",
                  isActive ? "shell:text-gray-1" : "",
                )
              }
              children={({ isActive }) => (
                <span data-active={isActive ? "true" : undefined}>
                  {n.label}
                </span>
              )}
            />
          ))}
        </div>

        <MobileNavDropdown
          open={open}
          setOpen={setOpen}
          activeLabel={activeLabel}
        />

        <div className="shell:ml-auto shell:flex shell:items-center shell:gap-2">
          <Link
            to="/blog/write"
            className="shell:t-btn shell:t-btn--primary shell:text-sm"
          >
            새 글 쓰기
          </Link>
        </div>
      </header>

      <main className="shell:relative shell:z-10 shell:flex-1">{children}</main>
      <footer className="shell:mt-14 shell:text-sm shell:text-[var(--muted-fg)]">
        © {new Date().getFullYear()} · Vite + Module Federation
        <BlogTotal />
      </footer>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <>
      <div className="shell:pointer-events-none shell:absolute shell:inset-0 shell:-z-10 [background:radial-gradient(60%_50%_at_50%_0%,rgb(99_102_241_/_0.25),transparent_60%)]" />
      <div className="shell:pointer-events-none shell:absolute shell:inset-0 shell:-z-10 shell:opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="shell:pointer-events-none shell:absolute shell:left-1/2 shell:top-[-80px] shell:-z-10 shell:size-[520px] shell:-translate-x-1/2 shell:rounded-full shell:bg-gradient-to-tr shell:from-fuchsia-500/20 via-sky-400/20 to-emerald-400/20 shell:blur-3xl" />
    </>
  );
}

function MobileNavDropdown({
  open,
  setOpen,
  activeLabel,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  activeLabel: string;
}) {
  const { pathname } = useLocation();
  const btnRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (e.key === "Escape") {
  //     setOpen(false);
  //     btnRef.current?.focus();
  //   }
  // };

  // useEffect(() => {
  //   if (!open) return;
  //   const prev = document.body.style.overflow;
  //   document.body.style.overflow = "hidden";
  //   const t = setTimeout(() => {
  //     rootRef.current
  //       ?.querySelector<HTMLAnchorElement>("#mobile-nav-menu a")
  //       ?.focus();
  //   }, 0);
  //   return () => {
  //     document.body.style.overflow = prev;
  //     clearTimeout(t);
  //   };
  // }, [open]);

  return (
    <div
      ref={rootRef}
      className="shell:relative shell:z-[70] shell:md:hidden"
      // onKeyDown={onKeyDown}
    >
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        className={cn(
          "shell:inline-flex shell:items-center shell:gap-2 shell:rounded-full shell:border shell:border-[var(--border)] shell:bg-[var(--card-bg)] shell:px-3 shell:py-1.5 shell:text-sm",
          "shell:focus:outline-none shell:focus-visible:ring-2 shell:focus-visible:ring-[var(--primary)]",
        )}
        onClick={() => setOpen(true)}
      >
        <span>{activeLabel}</span>
        <svg
          className={cn(
            "shell:size-4 shell:transition-transform",
            open && "shell:rotate-180",
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="shell:fixed shell:inset-0 shell:z-[60]" aria-hidden />
          <div
            id="mobile-nav-menu"
            role="menu"
            className={cn(
              "shell:absolute shell:left-0 shell:z-[70] shell:mt-2 shell:min-w-44 shell:overflow-hidden shell:rounded-2xl shell:border",
              "shell:border-white/20 dark:shell:border-white/10",
              "shell:bg-white/80 dark:shell:bg-neutral-900/70 shell:backdrop-blur-md",
              "supports-[backdrop-filter]:shell:bg-white/60 supports-[backdrop-filter]:dark:shell:bg-neutral-900/50",
              "shell:shadow-xl shell:ring-1 shell:ring-black/5",
            )}
          >
            <nav className="shell:flex shell:flex-col">
              {NAV.map((n) => {
                const isActive =
                  n.to === "/"
                    ? pathname === "/"
                    : pathname === n.to || pathname.startsWith(`${n.to}/`);
                return (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    onClick={() => {
                      console.log(n.to, n.end);
                      // setOpen(false);
                    }}
                    end={(n as any).end}
                    role="menuitem"
                    className={({ isActive: rrActive }) =>
                      cn(
                        "shell:block shell:px-4 shell:py-3 shell:text-sm shell:outline-none",
                        "hover:shell:bg-white/50 dark:hover:shell:bg-white/5",
                        "shell:focus-visible:ring-2 shell:focus-visible:ring-[var(--primary)]",
                        (rrActive || isActive) &&
                          "shell:text-[var(--primary)] shell:font-medium",
                      )
                    }
                  >
                    {n.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
