import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@srf/ui";
import ActivePill from "./active-pill";
import { useGaPageViews } from "@/hooks/use-ga-page-views";

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

  const activeLabel =
    NAV.find((n) =>
      n.to === "/"
        ? pathname === "/"
        : pathname === n.to || pathname.startsWith(`${n.to}/`),
    )?.label ?? "Menu";

  return (
    <div className="shell:relative shell:mx-auto shell:max-w-screen-2xl shell:px-5 shell:pt-8 shell:pb-16 shell:min-h-full shell:flex shell:flex-col ">
      {/* <HeroBackdrop /> */}

      <header className="shell:mb-8 shell:flex shell:items-center shell:gap-3">
        <div className="shell:flex shell:items-center shell:gap-2 shell:mr-2">
          <img
            src="/icon.png"
            alt=""
            className="shell:w-6 shell:h-6 shell:object-contain"
          />
          <div className="shell:text-xl shell:font-semibold shell:tracking-tight">
            방구석 코딩쟁이
          </div>
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
      </header>

      <main className="shell:relative shell:z-10 shell:flex-1">{children}</main>
      <footer className="shell:mt-14 shell:text-sm shell:text-[var(--muted-fg)]">
        © {new Date().getFullYear()} · Frontend Developer
      </footer>
    </div>
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

  return (
    <div ref={rootRef} className="shell:relative shell:z-[70] shell:md:hidden">
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
                    onClick={() => setOpen(false)}
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
