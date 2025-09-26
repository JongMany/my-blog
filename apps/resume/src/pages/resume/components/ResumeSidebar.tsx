import React from "react";
import { Card } from "../../../components/card";
import Contact from "./Contact";
import SkillsCompact from "./SkillsCompact";
import type { ResumeData } from "../../../service";

interface ResumeSidebarProps {
  profile: ResumeData["profile"];
  filteredSkills: string[] | undefined;
}

export function ResumeSidebar({ profile, filteredSkills }: ResumeSidebarProps) {
  return (
    <aside className="lg:col-span-3">
      <div className="lg:sticky lg:top-24 space-y-4">
        <Contact profile={profile} />
        {filteredSkills?.length ? (
          <Card className="p-4">
            <div className="mb-2 font-medium">Skills</div>
            <SkillsCompact items={filteredSkills} />
          </Card>
        ) : null}
      </div>
    </aside>
  );
}
