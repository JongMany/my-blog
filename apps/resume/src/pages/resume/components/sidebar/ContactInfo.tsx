import { Link } from "react-router-dom";
import { Mail, Github, BookOpen, Link as LinkIcon } from "lucide-react";
import { cn } from "@srf/ui";

import { Card } from "../../../../components/card";

export default function ContactInfo({
  profile,
}: {
  profile: {
    name: string;
    tagline: string;
    intro: string[];
    email: string;
    github?: string;
    blog?: string;
    portfolio?: string;
    photoUrl?: string;
  };
}) {
  return (
    <Card className="p-3 sm:p-4">
      <div className={cn("font-medium mb-2 sm:mb-3", "text-sm sm:text-base")}>
        Contact
      </div>
      <div
        className={cn(
          "grid gap-1 sm:gap-2",
          "grid-cols-2",
          "text-[10px] sm:text-xs",
        )}
      >
        <ContactLink
          href={`mailto:${profile.email}`}
          icon={<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          label="Email"
        />
        {profile.github && (
          <ContactLink
            href={profile.github}
            icon={<Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="GitHub"
            external
          />
        )}
        {profile.blog && (
          <ContactLink
            href={profile.blog}
            icon={<BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="Blog"
            external
          />
        )}
        {profile.portfolio && (
          <ContactLink
            to="/portfolio"
            icon={<LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="Portfolio"
          />
        )}
      </div>
    </Card>
  );
}

interface ContactLinkProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  to?: string;
  external?: boolean;
}

function ContactLink({ icon, label, href, to, external }: ContactLinkProps) {
  const baseClassName = cn(
    "rounded-full bg-[var(--surface)]",
    "px-2 py-1.5 sm:px-3 sm:py-2",
    "border border-[var(--border)]",
    "flex items-center gap-1.5 sm:gap-2",
    "transition-colors",
    "hover:bg-[var(--hover-bg)]",
    "active:scale-[0.98]",
    "text-left",
  );

  if (to) {
    return (
      <Link className={baseClassName} to={to}>
        {icon}
        <span className="truncate">{label}</span>
      </Link>
    );
  }

  if (href) {
    return (
      <a
        className={baseClassName}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {icon}
        <span className="truncate">{label}</span>
      </a>
    );
  }

  return null;
}
