import React from "react";
import { Card } from "../../../../components/card";

import SkillsSection from "./SkillsSection";
import type { ResumeData } from "../../../../service";
import ContactInfo from "./ContactInfo";
import { cn } from "@srf/ui";
import { useViewport } from "../../../../contexts/ViewportContext";

interface SidebarProps {
  profile: ResumeData["profile"];
  skills?: string[];
  className?: string;
}

export default function Sidebar({ profile, skills, className }: SidebarProps) {
  const { isLargeDesktop } = useViewport();

  return (
    <aside
      className={cn(isLargeDesktop ? "lg:col-span-3" : "col-span-1", className)}
    >
      <div className={cn("space-y-4", isLargeDesktop && "lg:sticky lg:top-24")}>
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
