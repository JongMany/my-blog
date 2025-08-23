import { Mail, Github, BookOpen, Link as LinkIcon } from "lucide-react";

import React from "react";
import { Card } from "./ui";
import { Link } from "react-router-dom";

export default function Contact({
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
    <Card className="p-4">
      <div className="font-medium">Contact</div>
      <div className="mt-2 grid gap-1 text-sm">
        <a
          className="rounded-full bg-[var(--surface)] px-2 py-1 border border-[var(--border)] w-fit flex items-center gap-1"
          href={`mailto:${profile.email}`}
        >
          <Mail size={16} />
          {profile.email}
        </a>
        {profile.github && (
          <a
            className="rounded-full bg-[var(--surface)] px-2 py-1 border border-[var(--border)] w-fit flex items-center gap-1"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} /> GitHub
          </a>
        )}
        {profile.blog && (
          <a
            className="rounded-full bg-[var(--surface)] px-2 py-1 border border-[var(--border)] w-fit flex items-center gap-1"
            href={profile.blog}
            target="_blank"
            rel="noreferrer"
          >
            <BookOpen size={16} /> Blog
          </a>
        )}
        {profile.portfolio && (
          <Link
            className="rounded-full bg-[var(--surface)] px-2 py-1 border border-[var(--border)] w-fit flex items-center gap-1"
            to={"/portfolio"}
            rel="noreferrer"
          >
            <LinkIcon size={16} /> Portfolio
          </Link>
        )}
      </div>
    </Card>
  );
}
