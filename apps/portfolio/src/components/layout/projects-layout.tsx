import { useOutlet, Link } from "react-router-dom";

export default function ProjectsLayout() {
  const outlet = useOutlet();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/portfolio"
          className="group flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-all hover:bg-[var(--hover-bg)] hover:border-[var(--primary)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>홈으로</span>
        </Link>
      </div>
      {outlet}
    </div>
  );
}
