export type Bullet = {
  text: string;
  tags?: string[];
  children?: Bullet[]; // ← 하위 불릿(들여쓰기) 지원
  portfolioLinks?: PortfolioLink[]; // ← 포트폴리오 링크들
};

export type PortfolioLink = {
  title: string;
  url: string;
  type?: "portfolio" | "demo" | "github" | "blog" | "other";
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  summary?: string; // ← 경력 요약(문단)
  stacks?: string[]; // 칩으로 표시
  bullets: Bullet[]; // 중첩 불릿
  keywordImageMap?: Record<string, string>; // 키워드-이미지 매핑
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
  period?: string;
  summary?: string;
  stacks?: string[];
  bullets: Bullet[];
  keywordImageMap?: Record<string, string>;
  portfolioLinks?: PortfolioLink[];
};

export type ResumeData = {
  profile: {
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
  experiences: Experience[];
  sideProjects?: SideProject[];
  education: Education[];
  activities: Activity[];
  skills?: string[];
};
