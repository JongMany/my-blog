import { Link } from "react-router-dom";
import { Mail, Github, BookOpen, Link as LinkIcon } from "lucide-react";
import { cn } from "@srf/ui";

import { Card } from "@/components/card";

export interface ContactInfo {
  email: string;
  github?: string;
  blog?: string;
  portfolio?: string;
}

interface ContactInfoProps {
  contact: ContactInfo;
}

export default function ContactInfo({ contact }: ContactInfoProps) {
  return (
    <Card className="p-3 sm:p-4">
      <div className="mb-2 sm:mb-3 text-base font-semibold text-[var(--fg)]">
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
          href={`mailto:${contact.email}`}
          icon={<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          label="Email"
        />
        {contact.github && (
          <ContactLink
            href={contact.github}
            icon={<Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="GitHub"
            external
          />
        )}
        {contact.blog && (
          <ContactLink
            href={contact.blog}
            icon={<BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="Blog"
            external
          />
        )}
        {contact.portfolio && (
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
