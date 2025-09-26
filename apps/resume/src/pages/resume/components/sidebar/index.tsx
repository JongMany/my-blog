import React from "react";
import { Card } from "../../../../components/card";

import SkillsSection from "./SkillsSection";
import type { ResumeData } from "../../../../service";
import ContactInfo from "./ContactInfo";
import { cn } from "@srf/ui";

interface SidebarProps {
  profile: ResumeData["profile"];
  skills?: string[];
  className?: string;
}

export default function Sidebar({ profile, skills, className }: SidebarProps) {
  return (
    <aside className={cn("lg:col-span-3", className)}>
      <div className="lg:sticky lg:top-24 space-y-4">
        <ContactInfo profile={profile} />
        {skills?.length ? (
          <Card className="p-4">
            <div className="mb-2 font-medium">Skills</div>
            <SkillsSection items={skills} />
          </Card>
        ) : null}
      </div>
    </aside>
  );
}
