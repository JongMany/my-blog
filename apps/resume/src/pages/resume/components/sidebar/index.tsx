import React from "react";
import { Card } from "../../../../components/card";

import SkillsSection from "./SkillsSection";
import type { ResumeData } from "../../../../service";
import ContactInfo from "./ContactInfo";

interface SidebarProps {
  profile: ResumeData["profile"];
  skills?: string[];
}

export function Sidebar({ profile, skills }: SidebarProps) {
  return (
    <aside className="lg:col-span-3">
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
