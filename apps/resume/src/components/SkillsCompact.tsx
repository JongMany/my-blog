import React from "react";
import { PillButton } from "./ui";
import { CursorTooltip } from "@srf/ui";

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

// 스킬별 상세 정보
const skillDetails: Record<
  string,
  { description: string; category: string; experience?: string }
> = {
  React: {
    description: "사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리",
    category: "Frontend Framework",
    experience: "3년+",
  },
  TypeScript: {
    description: "JavaScript에 정적 타입을 추가한 프로그래밍 언어",
    category: "Programming Language",
    experience: "3년+",
  },
  Vite: {
    description: "빠른 개발 서버와 빌드 도구",
    category: "Build Tool",
    experience: "2년+",
  },
  "Tailwind CSS": {
    description: "유틸리티 우선 CSS 프레임워크",
    category: "CSS Framework",
    experience: "2년+",
  },
  "Styled Components": {
    description: "CSS-in-JS 라이브러리",
    category: "CSS-in-JS",
    experience: "1년+",
  },
  "TanStack Query": {
    description: "서버 상태 관리 라이브러리",
    category: "State Management",
    experience: "2년+",
  },
  Zustand: {
    description: "가벼운 상태 관리 라이브러리",
    category: "State Management",
    experience: "1년+",
  },
  Lit: {
    description: "웹 컴포넌트 라이브러리",
    category: "Web Components",
    experience: "1년+",
  },
  WebSocket: {
    description: "실시간 양방향 통신을 위한 프로토콜",
    category: "Real-time Communication",
    experience: "2년+",
  },
  TradingView: {
    description: "금융 차트 및 트레이딩 플랫폼 개발을 위한 라이브러리",
    category: "Financial Technology",
    experience: "2년+",
  },
  Pnpm: {
    description: "빠르고 효율적인 패키지 매니저",
    category: "Package Manager",
    experience: "2년+",
  },
  Yarn: {
    description: "JavaScript 패키지 매니저",
    category: "Package Manager",
    experience: "1년+",
  },
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
            {skills.map((skill) => {
              const skillInfo = skillDetails[skill];

              if (!skillInfo) {
                return (
                  <PillButton key={skill} variant="soft" size="sm">
                    {skill}
                  </PillButton>
                );
              }

              return (
                <CursorTooltip
                  key={skill}
                  content={
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 mb-1">
                          {skill}
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {skillInfo.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
                          {skillInfo.category}
                        </span>
                        {skillInfo.experience && (
                          <span className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-lg border border-green-200">
                            {skillInfo.experience}
                          </span>
                        )}
                      </div>
                    </div>
                  }
                  delay={300}
                >
                  <PillButton variant="soft" size="sm" className="cursor-help">
                    {skill}
                  </PillButton>
                </CursorTooltip>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
