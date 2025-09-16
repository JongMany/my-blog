import React from "react";
import { PillButton } from "./ui";

const skillCategories = {
  Frontend: [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Styled Components",
  ],
  "State Management": ["TanStack Query", "Zustand"],
  Specialized: ["Lit", "WebSocket", "TradingView"],
  "Package Managers": ["Pnpm", "Yarn"],
};

export default function SkillsCompact({ items }: { items: string[] }) {
  const [open, setOpen] = React.useState(false);

  // 카테고리별로 스킬 분류
  const categorizedSkills = Object.entries(skillCategories)
    .map(([category, skills]) => ({
      category,
      skills: skills.filter((skill) => items.includes(skill)),
    }))
    .filter((cat) => cat.skills.length > 0);

  return (
    <div className="space-y-3">
      {categorizedSkills.map(({ category, skills }) => (
        <div key={category}>
          <div className="mb-1 text-xs font-medium text-[var(--fg-muted)]">
            {category}
          </div>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <PillButton key={skill} variant="soft" size="sm">
                {skill}
              </PillButton>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
