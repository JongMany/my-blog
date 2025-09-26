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
        <Link to={linkTo} className="t-btn text-sm">
          {linkText} →
        </Link>
      )}
    </div>
  );
}
