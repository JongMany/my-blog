import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { imageSource, useGoogleAnalyticsStats } from "@mfe/shared";
import { cn } from "@srf/ui";
import ActivePill from "./active-pill";
import { useGaPageViews } from "@/hooks/use-ga-page-views";

// ===== Types =====
export type NavItem = {
  to: string;
  label: string;
  end?: boolean;
};

export type LogoConfig = {
  logoSrc: string;
  alt: string;
  text: string;
};

export type LayoutDependencies = {
  navItems?: NavItem[];
  logoConfig?: LogoConfig;
  gaMeasurementId?: string;
  gaApiUrl?: string; // Google Analytics API URL (Apps Script)
  defaultActiveLabel?: string;
  footerText?: string;
};

// ===== Default Values =====
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", end: true },
  { to: "/blog", label: "Blog" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/resume", label: "Resume" },
];

export const DEFAULT_ACTIVE_LABEL = "Menu";

export function getDefaultLogoConfig(): LogoConfig {
  const isDevelopment = import.meta.env.MODE === "development";
  return {
    logoSrc: imageSource("/favicon.svg", "home", { isDevelopment }),
    alt: "방구석 코딩쟁이",
    text: "방구석 코딩쟁이",
  };
}

// ===== Pure Functions (Testable) =====
export function isNavItemActive(navItem: NavItem, pathname: string): boolean {
  if (navItem.to === "/") {
    return pathname === "/";
  }
  return pathname === navItem.to || pathname.startsWith(`${navItem.to}/`);
}

export function getActiveNavLabel(
  navItems: NavItem[],
  pathname: string,
  defaultLabel: string,
): string {
  const activeNavItem = navItems.find((item) =>
    isNavItemActive(item, pathname),
  );
  return activeNavItem?.label ?? defaultLabel;
}

// ===== Components =====
type LogoProps = {
  config: LogoConfig;
};

function Logo({ config }: LogoProps) {
  return (
    <Link
      to="/"
      className="shell:flex shell:items-center shell:gap-4 shell:mr-2"
    >
      <img
        src={config.logoSrc}
        alt={config.alt}
        className="shell:h-10 shell:w-10 md:shell:h-11 md:shell:w-11 shell:object-contain"
      />
      <div className="shell:text-xl shell:font-semibold shell:tracking-tight shell:no-underline">
        {config.text}
      </div>
    </Link>
  );
}

type DesktopNavProps = {
  navItems: NavItem[];
};

function DesktopNav({ navItems }: DesktopNavProps) {
  const navRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={navRef}
      className="shell:relative shell:z-0 shell:gap-1 shell:rounded-full shell:border shell:border-[var(--border)] shell:bg-[var(--card-bg)] shell:p-1 shell:hidden shell:md:flex"
    >
      <ActivePill containerRef={navRef} />
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "shell:relative shell:z-10 shell:rounded-full shell:px-3 shell:py-1.5 shell:text-sm shell:transition shell:focus:outline-none shell:focus-visible:ring-2 shell:focus-visible:ring-[var(--border)]",
              isActive
                ? "shell:text-[var(--fg)] shell:font-semibold"
                : "shell:text-[var(--muted-fg)]",
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

type MobileNavDropdownProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeLabel: string;
  navItems: NavItem[];
};

function MobileNavDropdown({
  open,
  setOpen,
  activeLabel,
  navItems,
}: MobileNavDropdownProps) {
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
          "shell:focus:outline-none shell:focus-visible:ring-2 shell:focus-visible:ring-[var(--border)]",
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
              {navItems.map((item) => {
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
                        "shell:focus-visible:ring-2 shell:focus-visible:ring-[var(--border)]",
                        rrActive || isActive
                          ? "shell:text-[var(--fg)] shell:font-semibold"
                          : "shell:text-[var(--muted-fg)]",
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

// ===== Main Layout Component =====
type LayoutProps = PropsWithChildren<LayoutDependencies>;

export default function Layout({
  children,
  navItems = DEFAULT_NAV_ITEMS,
  logoConfig,
  gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID,
  gaApiUrl = import.meta.env.VITE_GA_API_URL,
  defaultActiveLabel = DEFAULT_ACTIVE_LABEL,
  footerText = `© ${new Date().getFullYear()} · Frontend Developer`,
}: LayoutProps) {
  const { pathname } = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Logo config 주입 또는 기본값 사용
  const finalLogoConfig: LogoConfig = logoConfig ?? getDefaultLogoConfig();

  // Active label 계산
  const activeLabel = getActiveNavLabel(navItems, pathname, defaultActiveLabel);

  // GA 측정 ID가 제공된 경우에만 사용
  if (gaMeasurementId) {
    useGaPageViews(gaMeasurementId);
  }

  // 페이지 카운트 조회 (현재 페이지 기준)
  const { loading, error, totals } = useGoogleAnalyticsStats({
    apiUrl: gaApiUrl || "",
    scope: "page",
    pagePath: pathname,
    startDate: "30daysAgo",
    endDate: "today",
    shouldForceJsonp: true, // CORS 문제 회피를 위해 JSONP 강제 사용
  });

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="shell:relative shell:mx-auto shell:max-w-screen-2xl shell:px-5 shell:pt-8 shell:pb-16 shell:min-h-full shell:flex shell:flex-col">
      <header className="shell:mb-8 shell:flex shell:items-center shell:gap-3">
        <Logo config={finalLogoConfig} />
        <DesktopNav navItems={navItems} />
        <MobileNavDropdown
          open={isMobileNavOpen}
          setOpen={setIsMobileNavOpen}
          activeLabel={activeLabel}
          navItems={navItems}
        />
      </header>

      <main className="shell:relative shell:z-10 shell:flex-1">{children}</main>
      <footer className="shell:mt-14 shell:text-sm shell:text-[var(--muted-fg)]">
        <div className="shell:flex shell:items-center shell:gap-2">
          <span>{footerText}</span>
          {gaApiUrl && totals && (
            <span className="shell:text-[var(--muted-fg)]">
              · 조회수 {totals.screenPageViews.toLocaleString()}
            </span>
          )}
          {gaApiUrl && loading && (
            <span className="shell:text-[var(--muted-fg)]">· 로딩 중...</span>
          )}
          {gaApiUrl && error && (
            <span className="shell:text-[var(--muted-fg)]">
              · 조회수 불러오기 실패
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
