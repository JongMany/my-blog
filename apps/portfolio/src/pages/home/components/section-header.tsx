import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  linkTo?: string;
  linkText?: string;
  className?: string;
}

export function SectionHeader({
  title,
  linkTo,
  linkText,
  className = "flex items-center justify-between",
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {linkTo && linkText && (
        <Link
          to={linkTo}
          className="group flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-all hover:bg-[var(--hover-bg)] hover:border-[var(--primary)]"
        >
          <span>{linkText}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
