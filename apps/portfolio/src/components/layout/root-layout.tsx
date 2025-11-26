import { Link, NavLink, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@srf/ui";

interface NavigationItem {
  to: string;
  label: string;
  end?: boolean;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { to: "/portfolio", label: "Home", end: true },
  { to: "/portfolio/projects", label: "Projects" },
] as const;

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Portfolio</h2>
        <div>
          <Link to="/portfolio/projects" className="t-btn text-sm">
            모든 프로젝트
          </Link>
        </div>
      </div>

      <nav className="flex gap-1 rounded-full border border-[var(--border)] bg-[var(--card-bg)] p-1 text-sm">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "rounded-full px-3 py-1.5 transition",
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-ink)]"
                  : "hover:bg-[var(--hover-bg)]",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="t-card p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
