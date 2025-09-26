import React from "react";
import { SKILL_CATEGORIES } from "../../constants/skills";
import { PillButton } from "../../../../components";

interface SkillsSectionProps {
  /** 표시할 스킬 목록 */
  items: string[];
}

export default function SkillsSection({ items }: SkillsSectionProps) {
  // 카테고리별로 스킬 분류 및 필터링
  const categorizedSkills = React.useMemo(() => {
    return Object.entries(SKILL_CATEGORIES)
      .map(([category, skills]) => ({
        category,
        skills: skills.filter((skill) => items.includes(skill)),
      }))
      .filter((category) => category.skills.length > 0);
  }, [items]);

  // 스킬이 없는 경우 빈 상태 표시
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
  /** 카테고리 이름 */
  category: string;
  /** 해당 카테고리의 스킬 목록 */
  skills: string[];
}

function SkillCategory({ category, skills }: SkillCategoryProps) {
  return (
    <div className="space-y-1">
      {/* 카테고리 헤더 */}
      <h4 className="text-xs font-medium text-[var(--muted-fg)]">{category}</h4>

      {/* 스킬 목록 */}
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
  /** 스킬 이름 */
  skill: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

function SkillItem({ skill, className }: SkillItemProps) {
  return (
    <PillButton
      variant="soft"
      size="sm"
      className={`cursor-help ${className || ""}`}
      title={`${skill} 스킬`}
      aria-label={`${skill} 기술 스택`}
    >
      {skill}
    </PillButton>
  );
}
