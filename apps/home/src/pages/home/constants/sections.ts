import { Section } from "@/types/sections";

export const HOME_SECTIONS: Section[] = [
  {
    id: "blog",
    label: "Blog",
    description: "경험과 사유를 기록합니다",
    href: "blog",
    color: "from-slate-500 to-slate-400",
    size: "lg",
    tags: ["개발", "회고", "기록"],
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "창작물을 모았습니다",
    href: "portfolio",
    color: "from-slate-400 to-slate-300",
    size: "md",
  },
  {
    id: "resume",
    label: "Resume",
    description: "이력을 정리했습니다",
    href: "resume",
    color: "from-slate-400 to-slate-300",
    size: "sm",
  },
];
