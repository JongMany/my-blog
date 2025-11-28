import React from "react";
import { cn } from "@srf/ui";

import { useViewport } from "../../../../contexts/viewport-context";
import ContactInfo, {
  type ContactInfo as ContactInfoType,
} from "./contact-info";
import SkillsCard from "../skills-card";

interface SidebarProps {
  contact: ContactInfoType;
  skills?: string[];
  className?: string;
}

export default function Sidebar({ contact, skills, className }: SidebarProps) {
  const { isLargeDesktop } = useViewport();

  return (
    <aside
      className={cn(isLargeDesktop ? "lg:col-span-3" : "col-span-1", className)}
    >
      <div className={cn("space-y-4", isLargeDesktop && "lg:sticky lg:top-24")}>
        <ContactInfo contact={contact} />
        {/* 데스크톱에서만 skills 표시 */}
        {isLargeDesktop && <SkillsCard skills={skills} />}
      </div>
    </aside>
  );
}
