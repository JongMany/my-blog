import { Section } from "../../../types/sections";

export const HOME_SECTIONS: Section[] = [
  {
    id: "blog",
    label: "Blog",
    description: "경험을 사유하고 기록합니다",
    href: "/blog",
    color: "from-blue-500 to-cyan-500",
    size: "lg",
    tags: ["개발", "회고", "기록"],
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "창작물을 모았습니다",
    href: "/portfolio",
    color: "from-purple-500 to-pink-500",
    size: "md",
  },
  {
    id: "resume",
    label: "Resume",
    description: "이력을 정리했습니다",
    href: "/resume",
    color: "from-orange-500 to-red-500",
    size: "sm",
  },
];
