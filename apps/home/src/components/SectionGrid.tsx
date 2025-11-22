import { cn } from "@srf/ui";
import type { Section } from "../consts/sections";
import { SectionCard } from "./SectionCard";

interface SectionGridProps {
  sections: Section[];
}

export function SectionGrid({ sections }: SectionGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "gap-4 sm:gap-6 auto-rows-fr",
      )}
    >
      {sections.map((section, index) => (
        <SectionCard key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}
