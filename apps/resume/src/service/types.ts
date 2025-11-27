export type Bullet = {
  text: string;
  description?: string; // ← 섹션 설명
  tags?: string[];
  children?: Bullet[]; // ← 하위 불릿(들여쓰기) 지원
  portfolioLinks?: PortfolioLink[]; // ← 포트폴리오 링크들
};

export type PortfolioLink = {
  title: string;
  url: string;
  type?: "portfolio" | "demo" | "github" | "blog" | "other";
};

export type Section = {
  title: string;
  description?: string;
  bullets: Bullet[];
  portfolioLinks?: PortfolioLink[];
};

export type Experience = {
  companyName: string; // 회사명
  position: string; // 직책/역할
  workPeriod: string; // 근무 기간
  overview?: string; // 경력 요약(문단)
  techStack?: string[]; // 기술 스택 (칩으로 표시)
  sections?: Section[]; // 섹션들
  bullets?: Bullet[]; // 중첩 불릿 (기존 호환성을 위해 유지)
  tooltipImages?: Record<string, string>; // 키워드-툴팁 이미지 매핑
};

export type Education = {
  school: string;
  degree?: string;
  period: string;
  gpaMajor?: string;
  gpaOverall?: string;
  note?: string;
};

export type Activity = {
  title: string;
  period?: string;
  bullets: string[];
};

export type SideProject = {
  title: string;
  period?: string; // 프로젝트 기간
  overview?: string; // 프로젝트 요약
  techStack?: string[]; // 기술 스택
  bullets: Bullet[];
  tooltipImages?: Record<string, string>; // 키워드-툴팁 이미지 매핑
  portfolioLinks?: PortfolioLink[];
};

export type Profile = {
  name: string;
  tagline: string;
  intro: string[];
  email: string;
  github?: string;
  blog?: string;
  portfolio?: string;
  personalSite?: string;
  photoUrl?: string;
};

export type ResumeData = {
  profile: Profile;
  experiences: Experience[];
  sideProjects?: SideProject[];
  education: Education[];
  activities: Activity[];
  skills?: string[];
};
