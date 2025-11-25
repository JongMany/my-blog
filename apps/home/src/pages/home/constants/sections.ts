import { Section } from "../../../types/sections";

export const HOME_SECTIONS: Section[] = [
  {
    id: "blog",
    label: "Blog",
    description: "생각과 경험을 기록합니다",
    href: "/blog",
    color: "from-blue-500 to-cyan-500",
    size: "lg",
    tags: ["개발", "회고", "기록"],
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "만든 것들을 모았습니다",
    href: "/portfolio",
    color: "from-purple-500 to-pink-500",
    size: "md",
  },
  {
    id: "resume",
    label: "Resume",
    description: "경력과 스킬을 정리했습니다",
    href: "/resume",
    color: "from-orange-500 to-red-500",
    size: "sm",
  },
];
