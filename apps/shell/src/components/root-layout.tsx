import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { imageSource } from "@mfe/shared";
import { cn } from "@srf/ui";
import ActivePill from "./active-pill";
import { useGaPageViews } from "@/hooks/use-ga-page-views";

type NavItem = {
  to: string;
  label: string;
  end?: boolean;
};

const NAV: NavItem[] = [
  { to: "/", label: "Home", end: true },
  { to: "/blog", label: "Blog" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/resume", label: "Resume" },
];

const DEFAULT_ACTIVE_LABEL = "Menu";

function isNavItemActive(navItem: NavItem, pathname: string): boolean {
  if (navItem.to === "/") {
    return pathname === "/";
  }
  return pathname === navItem.to || pathname.startsWith(`${navItem.to}/`);
}

function useActiveNavLabel(pathname: string): string {
  const activeNavItem = NAV.find((item) => isNavItemActive(item, pathname));
  return activeNavItem?.label ?? DEFAULT_ACTIVE_LABEL;
}

function Logo() {
  const isDevelopment = import.meta.env.MODE === "development";
  const logoSrc = imageSource("/favicon.svg", "home", { isDevelopment });

  return (
    <Link
      to="/"
      className="shell:flex shell:items-center shell:gap-4 shell:mr-2"
    >
      <img
        src={logoSrc}
        alt="방구석 코딩쟁이"
        className="shell:h-10 shell:w-10 md:shell:h-11 md:shell:w-11 shell:object-contain"
      />
      <div className="shell:text-xl shell:font-semibold shell:tracking-tight shell:no-underline">
        방구석 코딩쟁이
      </div>
    </Link>
  );
}

function DesktopNav() {
  const navRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={navRef}
      className="shell:relative shell:z-0 shell:gap-1 shell:rounded-full shell:border shell:border-[var(--border)] shell:bg-[var(--card-bg)] shell:p-1 shell:hidden shell:md:flex"
    >
      <ActivePill containerRef={navRef} />
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "shell:relative shell:z-10 shell:rounded-full shell:px-3 shell:py-1.5 shell:text-sm shell:transition shell:focus:outline-none shell:focus-visible:ring-2 shell:focus-visible:ring-[var(--primary)]",
              isActive && "shell:text-gray-1",
            )
          }
        >
          {({ isActive }) => (
            <span data-active={isActive ? "true" : undefined}>
              {item.label}
            </span>
          )}
        </NavLink>
      ))}
    </div>
  );
}

function MobileNavDropdown({
  open,
  setOpen,
  activeLabel,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeLabel: string;
}) {
  const { pathname } = useLocation();

  const handleClose = () => setOpen(false);

  return (
    <div className="shell:relative shell:z-[70] shell:md:hidden">
      <button
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
          <div
            className="shell:fixed shell:inset-0 shell:z-[60]"
            aria-hidden
            onClick={handleClose}
          />
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
              {NAV.map((item) => {
                const isActive = isNavItemActive(item, pathname);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleClose}
                    end={item.end}
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
                    {item.label}
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

export default function Layout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const activeLabel = useActiveNavLabel(pathname);

  useGaPageViews(import.meta.env.VITE_GA_MEASUREMENT_ID);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="shell:relative shell:mx-auto shell:max-w-screen-2xl shell:px-5 shell:pt-8 shell:pb-16 shell:min-h-full shell:flex shell:flex-col">
      <header className="shell:mb-8 shell:flex shell:items-center shell:gap-3">
        <Logo />
        <DesktopNav />
        <MobileNavDropdown
          open={isMobileNavOpen}
          setOpen={setIsMobileNavOpen}
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
