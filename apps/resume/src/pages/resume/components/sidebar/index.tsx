import React from "react";
import { cn } from "@srf/ui";

import type { ResumeData } from "../../../../service";
import { Card } from "../../../../components/card";
import { useViewport } from "../../../../contexts/ViewportContext";
import ContactInfo from "./ContactInfo";
import SkillsSection from "./SkillsSection";

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
      <div
        className={cn(
          "space-y-4",
          isLargeDesktop && "lg:sticky lg:top-24",
        )}
      >
        <ContactInfo profile={profile} />
        {skills?.length ? (
          <Card className="p-3 sm:p-4">
            <div className={cn("mb-2 sm:mb-3 font-medium", "text-sm sm:text-base")}>
              Skills
            </div>
            <SkillsSection items={skills} />
          </Card>
        ) : null}
      </div>
    </aside>
  );
}
