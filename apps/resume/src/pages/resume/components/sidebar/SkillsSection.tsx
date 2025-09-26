import React from "react";
import { SKILL_CATEGORIES, type SkillCategory } from "../../constants/skills";
import { PillButton } from "../../../../components";

interface SkillsSectionProps {
  items: string[];
}

export default function SkillsSection({ items }: SkillsSectionProps) {
  const categorizedSkills = React.useMemo(() => {
    return Object.entries(SKILL_CATEGORIES)
      .map(([category, skills]) => ({
        category: category as SkillCategory,
        skills: skills.filter((skill) => items.includes(skill)),
      }))
      .filter((category) => category.skills.length > 0);
  }, [items]);

  if (categorizedSkills.length === 0) {
    return (
      <div
        className="text-sm text-[var(--muted-fg)]"
        role="status"
        aria-live="polite"
      >
        표시할 스킬이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3" role="region" aria-label="기술 스택 목록">
      {categorizedSkills.map(({ category, skills }) => (
        <SkillCategory key={category} category={category} skills={skills} />
      ))}
    </div>
  );
}

interface SkillCategoryProps {
  category: SkillCategory;
  skills: string[];
}

function SkillCategory({ category, skills }: SkillCategoryProps) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-medium text-[var(--muted-fg)]">{category}</h4>
      <div
        className="flex flex-wrap gap-1"
        role="list"
        aria-label={`${category} 스킬 목록`}
      >
        {skills.map((skill) => (
          <SkillItem key={skill} skill={skill} />
        ))}
      </div>
    </div>
  );
}

interface SkillItemProps {
  skill: string;
  className?: string;
}

function SkillItem({ skill, className }: SkillItemProps) {
  return (
    <PillButton
      variant="soft"
      size="sm"
      className={`cursor-help ${className || ""}`.trim()}
      title={`${skill} 스킬`}
      aria-label={`${skill} 기술 스택`}
    >
      {skill}
    </PillButton>
  );
}
