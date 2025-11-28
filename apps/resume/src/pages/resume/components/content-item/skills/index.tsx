import { cn } from "@srf/ui";

import { Card } from "@/components/card";
import SkillsSection from "./skills-section";

interface SkillsCardProps {
  skills?: string[];
  className?: string;
}

export default function SkillsCard({ skills, className }: SkillsCardProps) {
  if (!skills?.length) return null;

  return (
    <Card className={cn("p-3 sm:p-4", className)}>
      <div className={cn("mb-2 sm:mb-3 font-medium", "text-sm sm:text-base")}>
        Skills
      </div>
      <SkillsSection items={skills} />
    </Card>
  );
}
